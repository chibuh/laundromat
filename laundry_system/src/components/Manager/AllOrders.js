import * as React from 'react';
// import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Button from '@mui/material/Button';

import axios from "../../axios-study"

// Generate Order Data
// function createData(OrderID, Weight, OStatus, Submission_Date, Actual_Delivery_Date, LID) {
//   return { OrderID, Weight, OStatus, Submission_Date, Actual_Delivery_Date, LID };
// }

// const rows = [
//   createData(
//     0,
//     '16 Mar, 2019',
//     'Elvis Presley',
//     'Tupelo, MS',
//     'VISA ⠀•••• 3719',
//     312.44,
//   ),
//   createData(
//     1,
//     '16 Mar, 2019',
//     'Paul McCartney',
//     'London, UK',
//     'VISA ⠀•••• 2574',
//     866.99,
//   ),
//   createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
//   createData(
//     3,
//     '16 Mar, 2019',
//     'Michael Jackson',
//     'Gary, IN',
//     'AMEX ⠀•••• 2000',
//     654.39,
//   ),
//   createData(
//     4,
//     '15 Mar, 2019',
//     'Bruce Springsteen',
//     'Long Branch, NJ',
//     'VISA ⠀•••• 5919',
//     212.79,
//   ),
// ];

// function preventDefault(event) {
//   event.preventDefault();
// }

export default function AllOrders() {

  const [rows,setRows] = React.useState([]);
  
  React.useEffect(() => {
    axios.get(`/api/manager/allorder`)
    .then(response=>
    {
      console.log(response.data);
      setRows(response.data);
    })
    .catch(error=>console.log(error))
  }, [])


  return (
    <>
      <Title>Recent Unwashed Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Order Place Date</TableCell>
            <TableCell>Expected Delivery Data</TableCell>
            <TableCell >Confirm Wash</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow key={index}>
              <TableCell>{row.OrderID}</TableCell>
              <TableCell>{row.Weight}</TableCell>
              <TableCell>{row.OStatus? 'Washed' : 'Unwashed'}</TableCell>
              <TableCell>{row.Submission_Date.slice(0,10)}</TableCell>
              <TableCell>{row.Expected_Delivery_Date.slice(0,10)}</TableCell>
              <TableCell>{row.Actual_Delivery_Date ? row.Actual_Delivery_Date.slice(0,10) : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link> */}
    </>
  );
}