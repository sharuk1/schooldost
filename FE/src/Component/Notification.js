import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import { ListItem,List,ListItemAvatar,ListItemSecondaryAction } from '@mui/material';

import { useSelector, useDispatch } from "react-redux"
import { hideAlert, hideDialog ,hideSnackBar} from '../Actions/Notification';

import {Snackbar} from "@mui/material"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export function AlertComponent(){
    
    const dispatch = useDispatch()
    
    const {alert} = useSelector(state => state.notification);
    
    const {isAlert,alertTitle,alertMessage}=alert
    
    
    const handleClose = () => {
       dispatch(hideAlert())
    };
    
    return (
        <div>
      <Dialog
        open={isAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{alertTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
                {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );      
}   


export function DialogComponent(){
    
    const dispatch = useDispatch()
    
    const {dialog} = useSelector(state => state.notification);
    
    const {isDialog,dialogTitle,dialogMessage,callbackDialog}=dialog
    
    
    const handleClose = () => {
      dispatch(hideDialog())
    };
    
    return (
        <div className="dialog-box">
        <Dialog
          open={isDialog}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title" >{dialogTitle}</DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                  {dialogMessage}
              </DialogContentText>
            </DialogContent>
          <List className="dialog-box">
            <ListItem>
                <ListItemAvatar>
                <Button onClick={callbackDialog} variant="contained" className="button text-14">
                    OK
                </Button>    
                </ListItemAvatar>
                <ListItemSecondaryAction>
                <Button onClick={handleClose}  className=" button-secondary text-14">
              Close
            </Button>
                </ListItemSecondaryAction>
            </ListItem>
          </List>
        
        </Dialog>
      </div>
    )    
}

export function SnackBarComponent(){
  const {snackBar} = useSelector(state => state.notification);
    
  const {isSnackBar,snackBarMessage}=snackBar
  const dispatch = useDispatch()
  const handleSnackBar = () => {
    dispatch(hideSnackBar())
}
    return (
      <Snackbar
      anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
      }}
      onClose={handleSnackBar}
      message={snackBarMessage}
      open={isSnackBar}
      autoHideDuration={6000}
  />
    )
}

