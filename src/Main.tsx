import React from 'react';
import { Paper, Button, Box, Typography, TextField, styled } from '@mui/material';
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

const RootContainer = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-height: 70vh;
`

const StyledPaper = styled(Paper)`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
`

const StyledInsider = styled(Box)`
  min-width: 20rem;
  border: 1px solid #BB00AA;
  display: flex;
  flex-direction: column;
`

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
      <RootContainer>
        <StyledPaper>
          <StyledInsider>
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
          </StyledInsider>
        </StyledPaper>
      </RootContainer>
    )
  } else {
    return (
      <RootContainer>
        <ConnectWalletButton />
      </RootContainer>
    )
  }
}