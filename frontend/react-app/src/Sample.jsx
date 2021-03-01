import { makeStyles } from '@material-ui/core'
import { useEffect } from 'react';
import * as vis from 'vis';

const useStyles = makeStyles(() => ({
  root: {
    width: '600px',
    height: '600px',
  }
}))

export const Sample = () => {
  const classes = useStyles();
  useEffect(() => {
    const nodes = new vis.DataSet([
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
      { id: 3, label: 'C' },
      { id: 4, label: 'D' },
      { id: 5, label: 'E' },
      { id: 6, label: 'F' },
      { id: 7, label: 'G' },
      { id: 8, label: 'H' },
    ])

    const edges = new vis.DataSet([
      { from: 1, to: 2, arrows: 'to' },
      { from: 1, to: 3, arrows: 'to' },
      { from: 3, to: 4, arrows: 'to' },
      { from: 6, to: 1, arrows: 'to' },
      { from: 7, to: 8, arrows: 'to' },
      { from: 8, to: 7, arrows: 'to' },
    ]);

    const container = document.getElementById('network');
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {
    };
    new vis.Network(container, data, options);
  }, [])

  return (
    <div className={classes.root} id="network"></div>
  )
}