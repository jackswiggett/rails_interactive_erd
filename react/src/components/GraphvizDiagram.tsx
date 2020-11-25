import { graphviz } from 'd3-graphviz';
import { transition } from 'd3-transition';
import keyBy from 'lodash/keyBy';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import useResizeAware from 'react-resize-aware';
import { RingLoader } from 'react-spinners';
import { digraph, toDot } from 'ts-graphviz';
import styles from '../styles.module.scss';
import { Schema } from '../types';
import { usePrevious } from '../utils';

interface Props {
  /** Information about the database schema */
  schema: Schema;
  /** Name of the currently selected entity */
  entityName?: string;
  /** Callback to select an entity */
  setEntityName: (entityName?: string) => void;
}

/**
 * Interactive entity relationship diagram rendered using d3-graphgiz.
 * Requires @hpcc-js/wasm to be loaded elsewhere before this component is rendered.
 */
const GraphvizDiagram: React.FC<Props> = ({ schema: { entities }, entityName, setEntityName }) => {
  const entitiesByName = useMemo(() => keyBy(entities, 'name'), [entities]);

  const edges = useMemo(() => {
    const _edges: Array<[string, string]> = [];

    entities.forEach((entity) => {
      entity.columns.forEach((column) => {
        if (column.hideEdge) return;

        column.associations.forEach((association) => {
          _edges.push([association, entity.name]);
        });
      });
    });

    return _edges;
  }, [entities]);

  const getDotNotation = () => {
    // Config values are copied from rails-erd dot file output
    const graph = digraph('G', {
      rankdir: 'LR',
      ranksep: '0.5',
      nodesep: '0.4',
      pad: '0.4,0.4',
      margin: '0,0',
      concentrate: true,
      splines: 'spline',
    });

    const addEntityToGraph = (name: string) => {
      if (!graph.existNode(name)) {
        graph.createNode(name, {
          shape: 'Mrecord',
          label: entitiesByName[name].friendlyName,
          fontname: 'Arial',
          margin: '0.1,0.12',
        });
      }
    };

    if (entityName) {
      // Only show entities connected to this one
      addEntityToGraph(entityName);

      edges.forEach((edge) => {
        const [fromName, toName] = edge;

        if (fromName === entityName || toName === entityName) {
          edge.forEach(addEntityToGraph);
          graph.createEdge(edge);
        }
      });
    } else {
      // Show all entities
      entities.map(({ name }) => name).forEach(addEntityToGraph);
      edges.forEach((edge) => graph.createEdge(edge));
    }

    return toDot(graph);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [resizeListener, sizes] = useResizeAware();

  // Handle click events on graph nodes
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof SVGTextElement) {
        const parent = event.target.parentElement;

        if (parent?.classList.value === 'node') {
          const name = parent.getElementsByTagName('title').item(0)?.textContent;
          setEntityName(name ?? undefined);
        }
      }
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  });

  const renderGraph = () => {
    const { width, height } = sizes;

    if (!containerRef.current || !width || !height) return null;

    return graphviz(containerRef.current)
      .engine('dot')
      .renderDot(getDotNotation())
      .width(width)
      .height(height)
      .fit(true)
      .zoomScaleExtent([0.5, 5]);
  };

  const previousEntityName = usePrevious(entityName);
  const [isLoading, setIsLoading] = useState(false);

  // Re-render graph and reset zoom when entity changes
  useEffect(() => {
    const graph = renderGraph();
    if (!graph) return;

    if (graph.zoomSelection()) graph.resetZoom();

    // skip the transition if we're switching between the single entity and entire database view,
    // since we also change the size of the graph and a transition looks janky
    const showTransition = entityName && previousEntityName;

    graph.transition(() => transition('main').duration(showTransition ? 1000 : 0) as any);

    // if we are not animating the transition, show a loading indicator
    setIsLoading(!showTransition);
    graph.on('end', () => setIsLoading(false));
  }, [containerRef.current, entityName]);

  // Re-render graph when window size changes
  useEffect(() => {
    if (previousEntityName !== entityName) return;

    renderGraph();
  }, [containerRef.current, sizes.width, sizes.height]);

  return (
    <div className={styles.leftPanel}>
      {resizeListener}
      <div className={styles.diagram} ref={containerRef} />
      {isLoading && (
        <div className={styles.loadingIndicator}>
          {!entityName && <RingLoader />}
        </div>
      )}
    </div>
  );
};

export default GraphvizDiagram;
