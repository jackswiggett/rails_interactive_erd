/** SCSS module class names and variables */
declare module '*.module.scss' {
  const styles: {
    [name: string]: string;
  };
  export = styles;
}

declare module 'react-resize-aware';
