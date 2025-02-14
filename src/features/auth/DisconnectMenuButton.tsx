import React from 'react'
import Blockies from 'react-blockies'
import { Menu, MenuItem, Button } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAccount, useEnsAvatar, useDisconnect } from 'wagmi'

export const DisconnectMenuButton = () => {
  const { address } = useAccount()
  // const { data: ensAvatar } = useEnsAvatar({ addressOrName: address })
  const { disconnect } = useDisconnect()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick} color='secondary' startIcon={
        false ? <></>
          : <Blockies seed={address?.toLocaleLowerCase() ?? ''} size={10} scale={3} />
      }></Button>
      <Menu
        id="profile-menu" MenuListProps={{ 'aria-labelledby': 'menu-buttom', }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* <Divider sx={{ my: 0.1 }} /> */}
        <MenuItem onClick={handleClose} >
          <Button startIcon={<LogoutIcon />} onClick={() => disconnect()}>Disconnect</Button>
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}