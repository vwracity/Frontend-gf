import { useState, useEffect } from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, TextField, MenuItem
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios'

ChartJS.register(ArcElement, Tooltip, Legend);

function ListagemInvestimentos() {
  const [investimentos, setInvestimentos] = useState([])
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    carregarInvestimentos()
  }, [])

  const carregarInvestimentos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/investimentos')
      setInvestimentos(response.data)
    } catch (error) {
      toast.error('Erro ao carregar investimentos')
    }
  }

  const handleDelete = async (id) => {
    
    try {
        await axios.delete(`http://localhost:3000/investimentos/${id}`)
        toast.success('Investimento excluído com sucesso!')
        carregarInvestimentos()
    } catch (error) {
        toast.error('Erro ao excluir investimento')
    }
    
  }

  const handleUpdate = async (investimento) => {
    try {
      await axios.put(
        `http://localhost:3000/investimentos/${investimento.id}`,
        investimento
      )
      toast.success('Investimento atualizado com sucesso!')
      setEditando(null)
      carregarInvestimentos()
    } catch (error) {
      toast.error('Erro ao atualizar investimento')
    }
  }

  // Dados para o gráfico
  const dadosGrafico = {
    labels: [...new Set(investimentos.map(inv => inv.tipo))],
    datasets: [{
      data: Object.values(investimentos.reduce((acc, inv) => {
        acc[inv.tipo] = (acc[inv.tipo] || 0) + inv.valor;
        return acc;
      }, {})),
      backgroundColor: [
        '#1976d2',
        '#2196f3',
        '#64b5f6',
        '#90caf9',
        '#bbdefb',
        '#e3f2fd'
      ]
    }]
  }

  return (
    <div className="container">
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investimentos.map((investimento) => (
                <TableRow key={investimento.id}>
                  <TableCell>{investimento.nome}</TableCell>
                  <TableCell>{investimento.tipo}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(investimento.valor)}
                  </TableCell>
                  <TableCell>
                    {new Date(investimento.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => setEditando(investimento)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(investimento.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {editando && (
        <div className="form-container">
          <h3>Editar Investimento</h3>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={editando.nome}
            onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
          />
          <TextField
            select
            label="Tipo"
            fullWidth
            margin="normal"
            value={editando.tipo}
            onChange={(e) => setEditando({ ...editando, tipo: e.target.value })}
          >
            {[
              'Ações',
              'Fundos Imobiliários',
              'Tesouro Direto',
              'Poupança',
              'CDB',
              'Outros'
            ].map((tipo) => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor"
            type="number"
            fullWidth
            margin="normal"
            value={editando.valor}
            onChange={(e) => setEditando({ ...editando, valor: Number(e.target.value) })}
          />
          <TextField
            label="Data"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={editando.data.split('T')[0]}
            onChange={(e) => setEditando({ ...editando, data: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdate(editando)}
            style={{ marginRight: '1rem', marginTop: '1rem' }}
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            onClick={() => setEditando(null)}
            style={{ marginTop: '1rem' }}
          >
            Cancelar
          </Button>
        </div>
      )}

      <div className="chart-container">
        <h3>Distribuição dos Investimentos por Tipo</h3>
        <Pie data={dadosGrafico} />
      </div>
    </div>
  )
}

export default ListagemInvestimentos;