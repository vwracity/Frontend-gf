import { useState } from 'react'
import { TextField, Button, MenuItem } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import { IMaskInput } from 'react-imask'

const tiposInvestimento = [
  'Ações',
  'Fundos Imobiliários',
  'Tesouro Direto',
  'Poupança',
  'CDB',
  'Outros'
]

function CadastroInvestimento() {
  const [investimento, setInvestimento] = useState({
    nome: '',
    tipo: '',
    valor: '',
    data: ''
  })

  // Validação para o formato DD/MM/AAAA
  const isDateValid = (dateString) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(dateString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Converte a data do formato DD/MM/AAAA para o formato AAAA-MM-DD
    const [day, month, year] = investimento.data.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    // Adicione uma validação simples para a data
    if (!isDateValid(investimento.data)) {
        toast.error('Formato de data inválido. Use DD/MM/AAAA.');
        return;
    }

    try {
      await axios.post('http://localhost:3000/investimentos', {
          ...investimento,
          data: formattedDate
      });
      toast.success('Investimento cadastrado com sucesso!');
      setInvestimento({ nome: '', tipo: '', valor: '', data: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao cadastrar investimento');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Cadastrar Novo Investimento</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={investimento.nome}
            onChange={(e) => setInvestimento({ ...investimento, nome: e.target.value })}
          />
          <TextField
            select
            label="Tipo"
            fullWidth
            margin="normal"
            value={investimento.tipo}
            onChange={(e) => setInvestimento({ ...investimento, tipo: e.target.value })}
          >
            {tiposInvestimento.map((tipo) => (
              <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Valor"
            type="number"
            fullWidth
            margin="normal"
            value={investimento.valor}
            onChange={(e) => setInvestimento({ ...investimento, valor: Number(e.target.value) })}
          />
          
          {/* Componente TextField com IMask */}
          <TextField
            label="Data (DD/MM/AAAA)"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: IMaskInput,
              inputProps: {
                mask: '00/00/0000',
                value: investimento.data,
                onAccept: (value) => setInvestimento({ ...investimento, data: value })
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
          >
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CadastroInvestimento;