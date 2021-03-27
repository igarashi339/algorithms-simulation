import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  cell: {
    textAlign: 'center'
  }
}))

export const DijkstraTable = ({ steps }) => {
  const classes = useStyles()

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Node ID</TableCell>
          <TableCell>Cost Fixed</TableCell>
          <TableCell>Label</TableCell>
          <TableCell>Prev Node</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {steps.map((row, index) => (
          <TableRow key={index}>
            <TableCell className={classes.cell}>{row.id}</TableCell>
            <TableCell className={classes.cell}>{row.fixed ? 'TRUE' : 'FALSE'}</TableCell>
            <TableCell className={classes.cell}>{row.label === -1 ? "∞" : row.label}</TableCell>
            <TableCell className={classes.cell}>{row.prevNode === -1 ? "-" : row.prevNode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}