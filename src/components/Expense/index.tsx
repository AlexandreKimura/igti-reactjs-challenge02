import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { getExpenses } from "../../services/api";

const months = [
  { id: "01", month: "Janeiro" },
  { id: "02", month: "Fevereiro" },
  { id: "03", month: "Março" },
  { id: "04", month: "Abril" },
  { id: "05", month: "Maio" },
  { id: "06", month: "Junho" },
  { id: "07", month: "Julho" },
  { id: "08", month: "Agosto" },
  { id: "09", month: "Setembro" },
  { id: "10", month: "Outubro" },
  { id: "11", month: "Novembro" },
  { id: "12", month: "Dezembro" },
];

const years = ["2020", "2021"];

export interface IExpense {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  mes: string;
  dia: string;
}

export default function Expense() {
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [month, setMonth] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    (async function getExpensesFromDB() {
      try {
        if (date) {
          setExpenses(await getExpenses(date));
        }
      } catch (err) {}
    })();
  }, [date]);

  useEffect(() => {
    if (month && year) {
      setDate(`${year}-${month}`);
    }
  }, [year, month]);

  function handleDate(e: SelectChangeEvent<string>) {
    e.preventDefault();
    const dateInfo = e.target.value;
    if (years.indexOf(dateInfo) > -1) {
      setYear(dateInfo);
    } else {
      const monthId = months.find((m) => m.month === dateInfo);
      if (monthId) {
        setMonth(monthId.id);
      }
    }
  }

  function totalExpenseValue(): string {
    let total = 0;
    expenses.map((ex) => {
      return (total += ex.valor);
    });
    return total.toFixed(2).replace(".", ",");
  }

  return (
    <Container>
      <Box
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        marginTop="3rem"
      >
        <Box display="flex" width="15rem">
          <FormControl fullWidth>
            <InputLabel id="year">Ano</InputLabel>
            <Select
              labelId="year"
              onChange={(e: SelectChangeEvent<string>) => handleDate(e)}
              fullWidth
              defaultValue=""
            >
              {years.map((y, index) => (
                <MenuItem key={index} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="month">Mês</InputLabel>
            <Select
              id="month"
              onChange={(e: SelectChangeEvent<string>) => handleDate(e)}
              fullWidth
              defaultValue=""
            >
              {months.map((m) => (
                <MenuItem key={m.id} value={m.month}>
                  {m.month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <Typography>
            Despesa total: <strong>{totalExpenseValue()}</strong>
          </Typography>
        </Box>
      </Box>
      {expenses.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Despesa</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Dia</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((ex) => (
                <TableRow key={ex.id}>
                  <TableCell>{ex.descricao}</TableCell>
                  <TableCell>{ex.categoria}</TableCell>
                  <TableCell>{ex.dia}</TableCell>
                  <TableCell>{ex.valor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
