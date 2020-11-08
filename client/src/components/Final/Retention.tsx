import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function Retention() {
    const [data, setData] = useState<Array<any>>([]);
    const [startDate, setStartDate] = useState(new Date());



    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`http://localhost:3001/events/retention?dayZero=${startDate.getTime()}`)
            setData(data);
        })()
    }, [startDate]);


    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);

    function createData(start: string, end: string, weeks: Array<number>) {
        const object: any = {};
        object.empty = `${start}-${end}`
        weeks.forEach((weekPercentage, index) => {
            object[`week${index}`] = weekPercentage
        })
        return object;
    }

    const rows: any[] = data.map((retentionWeek, index) => {
        return createData(retentionWeek.start, retentionWeek.end, retentionWeek.weeklyRetention);
    })

    const useStyles = makeStyles({
        table: {
            minWidth: 850,
        },
    });
    const classes = useStyles();

    return (
        <div>
            <strong>Pick A Date:</strong><DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {rows[0] ? Object.keys(rows[0]).map(key => {
                                return <StyledTableCell align="left">{key}</StyledTableCell>
                            }) : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.name}>
                                {Object.keys(rows[0]).map(key => {
                                    return <StyledTableCell align="left">{row[key]}</StyledTableCell>
                                })}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}