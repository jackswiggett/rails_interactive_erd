import keyBy from 'lodash/keyBy';
import React, { useEffect, useMemo, useRef } from 'react';
import useResizeAware from 'react-resize-aware';
import { attribute as _, Digraph, Edge, Node, toDot } from 'ts-graphviz';
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
    const result: Array<[string, string]> = [];

    entities.forEach((entity) => {
      entity.columns.forEach((column) => {
        if (column.hideEdge) return;

        column.associations.forEach((association) => {
          result.push([association, entity.name]);
        });
      });
    });

    return result;
  }, [entities]);

  const getDotNotation = () => {
    // Config values are copied from rails-erd dot file output
    const graph = new Digraph(undefined, {
      [_.rankdir]: 'LR',
      [_.ranksep]: 0.5,
      [_.nodesep]: 0.4,
      [_.pad]: 0.4,
      [_.margin]: 0,
      [_.concentrate]: true,
      [_.splines]: 'spline',
    })

    const addEntityToGraph = (name: string) => {
      const existingNode = graph.getNode(name);
      if (existingNode) return existingNode;

      const newNode = new Node(name, {
        [_.shape]: 'Mrecord',
        [_.label]: entitiesByName[name].friendlyName,
        [_.fontname]: 'Arial',
        [_.margin]: '%0.1,%0.12',
      })
      graph.addNode(newNode);

      return newNode;
    };

    const addEdgeToGraph = (names: [string, string]) => {
      const fromNode = addEntityToGraph(names[0]);
      const toNode = addEntityToGraph(names[1]);

      const edge = new Edge([fromNode, toNode]);
      graph.addEdge(edge);
    };

    if (entityName) {
      // Only show entities connected to this one
      addEntityToGraph(entityName);

      edges.forEach((edge) => {
        const [fromName, toName] = edge;

        if (fromName === entityName || toName === entityName) {
          addEdgeToGraph(edge);
        }
      });
    } else {
      // Show all entities
      entities.map(({ name }) => name).forEach(addEntityToGraph);
      edges.forEach(addEdgeToGraph);
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

  const transitionEnabled = useRef(false);

  const renderGraph = () => {
    const { width, height } = sizes;

    if (!containerRef.current || !width || !height) return;

    const graph = d3.select(containerRef.current).graphviz()
      .engine('dot')
      .renderDot(getDotNotation())
      .width(width)
      .height(height)
      .fit(true)
      .zoomScaleExtent([0.5, 5]);

    if (graph.zoomSelection()) {
      graph.resetZoom(d3.transition('resetzoom').duration(750) as any);
    }

    if (transitionEnabled.current) graph.transition(d3.transition('main').duration(750) as any);

    // Only enable transitions after the first render
    transitionEnabled.current = true;
  };

  const previousEntityName = usePrevious(entityName);

  // Render the graph on initial load, and when the size changes (either resizing the browser
  // window, or switching between top-level view and entity-level view)
  useEffect(() => {
    renderGraph();
  }, [containerRef.current, sizes.width, sizes.height]);

  // Re-render the graph when switching from one entity to another
  useEffect(() => {
    if (previousEntityName && entityName) {
      renderGraph();
    }
  }, [entityName]);

  return (
    <div className={styles.leftPanel}>
      {resizeListener}
      <div className={styles.diagram} ref={containerRef} />
      {entityName ? (
        <button
          type="button"
          className={styles.viewAllButton}
          onClick={() => setEntityName(undefined)}
        >
          View All Tables
        </button>
      ) : null}
    </div>
  );
};

export default GraphvizDiagram;
