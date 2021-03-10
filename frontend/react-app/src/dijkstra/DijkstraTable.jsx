import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

export const DijkstraTable = ({ steps }) => {

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ノード番号</TableCell>
          <TableCell>コスト確定</TableCell>
          <TableCell>ラベル</TableCell>
          <TableCell>ひとつ前のノード</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {steps.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.fixed ? 'TRUE' : 'FALSE'}</TableCell>
            <TableCell>{row.label}</TableCell>
            <TableCell>{row.prevNode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}