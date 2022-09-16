import React from 'react';
import { Paper, Button, Box, Container, Grid, Typography, TextField } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useAccount } from 'wagmi';
import { useSnackbar } from 'notistack';
import { mintThunk } from './features/mint/mintTunk';
import { useAppDispatch, useAppSelector } from './hooks';
import { MintThunkInput } from './features/mint/mintTunk';
import { useEffect, useState } from 'react';
import { ChainClient } from './common/chainclient';
import { ConnectWalletButton } from './features/auth/ConnectWalletButton';
import { CONTRACT_ADDRESS } from './common/app.config';

const styles: { root: React.CSSProperties, paper: React.CSSProperties, central: React.CSSProperties } = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: '70vh',
    border: '1px solid purple'
  },
  paper: {
    flexGrow: 1,
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'middle',
    padding: '3rem',
  },
  central: {
    display: 'flex',
    justifyContent: 'center',
    border: '1px purple solid',
    borderRadius: '4px',
    padding: '.5rem',
    margin: '.1rem',
  }
};

export const Main = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [currentPrice, setCurrentPrice] = useState(0);
  const { address, isConnected } = useAccount();

  const [phrase, setPhrase] = useState('');

  const requestMinting = async (_phrase: string) => {
    var mintRequest = { phrase: _phrase } as MintThunkInput;
    var res = await dispatch(mintThunk(mintRequest));

    const result = res.payload as any;
    if (result.id) {
      enqueueSnackbar(`${_phrase}: ${result.id}`);
    }
  }

  async function fetchCurrentPrice(address: string) {
    const chainClient = new ChainClient(address);
    await chainClient.getCurrentPrice();
  }

  useEffect(() => {
    console.log('Contract Address:', CONTRACT_ADDRESS);
    if (address) {
      fetchCurrentPrice(address);
    }
  }, [address])

  if (isConnected) {
    return (
      <Box style={styles.root}>
        <Paper style={styles.paper}>
          <TextField
            id="input-phrase"
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="Type your phrase"
            variant="outlined"
            sx={{
              input: {
                textAlign: "center",
              },
              margin: '.5rem',
            }}
          />
          <Button
            variant="contained"
            sx={{ margin: '.5rem' }}
            disabled={phrase == ''}
            startIcon={<RocketLaunchIcon />}
            onClick={() => requestMinting(phrase)}>
            Mint
          </Button>

          <Container maxWidth={false} style={styles.central}>
            <Grid container justifyContent='center' alignItems='center' sx={{ height: '20vh', border: '1px dotted #0000AA' }}>
              <Grid item container maxWidth='120vw'>
                <Grid item xs={6} sx={{ height: 80, border: '1px dashed', borderColor: 'primary.main' }}>
                  <Typography variant='h4'>Mint AI NFT</Typography>
                </Grid>
                <Grid item xs={6} sx={{ height: 80, border: '1px dashed', borderColor: 'secondary.main' }}>
                  <Typography variant='h4'>Guess and Win</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Box>
    )
  } else {
    return (
      <Paper style={styles.root}>
        <ConnectWalletButton />
      </Paper>
    )
  }
}