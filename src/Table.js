import React, { useState, useCallback } from "react";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
export default function Tables({ columns, data }) {

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // setFilter,
    page,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, rowCount = rows.length },
    
  } = useTable(
    {
      columns,
      data,
      initialState: {pageSize : 5,pageIndex: 0 }
    },
    useFilters,
    useSortBy,
    usePagination,
    
  );
  


  // console.log(rows, 'rows');
  // console.log(page, 'page');
  // console.log(state, 'state');
  // console.log(pageIndex, 'index of page')

  const handleChangePage = (event,newPage) => {
    // console.log(newPage, 'newPage')
    if (newPage === pageIndex + 1) {
      nextPage()
    } else if (newPage === pageIndex - 1) {
      previousPage()
    } else {
      gotoPage(newPage)
    }
  };


  const handleChangeRowsPerPage = (event) => {
    setPageSize(event.target.value);
  };


  // console.log(getTableProps(), 'gett');
  // Render the UI for your table
  return (

    <TableContainer>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                {/* console.log("column", column.getSortByToggleProps()) */}
                return (
                  <TableCell
                  align="center"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{fontWeight:'bold'}}

                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>

                </TableCell> 
                
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            {/* console.log(row.cells, 'valllll'); */}
            return (
              <TableRow {...row.getRowProps()} hover>
                {row.cells.map(cell => {
                  {/* console.log(cell,'cell'); */}
                  return (
                    <TableCell {...cell.getCellProps()} align="center">
                    {cell.render("Cell")}
                    
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowCount}
          rowsPerPage={pageSize}
          page={pageIndex}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </TableContainer>
  );
}



