import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

export const DijkstraTable = ({ steps }) => {

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
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.fixed ? 'TRUE' : 'FALSE'}</TableCell>
            <TableCell>{row.label === -1 ? "∞" : row.label}</TableCell>
            <TableCell>{row.prevNode === -1 ? "-" : row.prevNode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}