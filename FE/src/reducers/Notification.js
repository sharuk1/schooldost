import { FETCHING ,STOP_LOADER,SHOW_ALERT,HIDE_ALERT,SHOW_DIALOG,HIDE_DIALOG,SHOW_SNACK_BAR,HIDE_SNACK_BAR} from "../Constant/Reducer/Reducer.js"


export default function reducer(
    
    state={
    
        loader:{
            isLoading:false,
            loaderMessage:""
        },
        dialog:{
            isDialog:false,
            dialogTitle:"",
            dialogMessage:"",
            callbackDialog:()=>{}
        },
        
        snackBar:{
            isSnackBar:false,
            snackBarMessage: "",
            
        },
        alert:{
            isAlert:false,
            alertMessage:"",
            alertTitle:"",
        }
        
        
        
    }
    ,action
){
    switch (action.type) {
        case SHOW_SNACK_BAR:
          return {
            ...state,
            snackBar:{
                snackBarMessage: action.message,
                isSnackBar:true 
            }
          };
    
        case HIDE_SNACK_BAR:
          return {
            ...state,
            snackBar:{
                snackBarMessage: "",
                isSnackBar:false 
            }
          };
    
        case FETCHING:
          return {
            ...state,
            loader:{
                isLoading:true,
                loaderMessage: action.data.loaderMessage,
            }
          };
        case STOP_LOADER:
          return {
            ...state,
            loader:{
                isLoading:false,
                loaderMessage: action.data.loaderMessage,
            }
          };
        case SHOW_ALERT:
          return {
            ...state,
            alert:{
                isAlert:true,
                alertTitle: action.data.title,
                alertMessage: action.data.message,
            }
          };
        case HIDE_ALERT:
          return {
            ...state,
            alert:{
                isAlert:false,
                alertTitle: "",
                alertMessage: "",
            }
          };
        case SHOW_DIALOG:
          return {
            ...state,
            dialog:{
                isDialog:true,
                dialogTitle: action.data.title,
                dialogMessage: action.data.message,
                callbackDialog: action.data.callback,
            },
            
          };
        case HIDE_DIALOG:
          return {
            ...state,
            dialog:{
                isDialog:false,
                dialogTitle: "",
                dialogMessage: "",
                callbackDialog: ()=>{},
            },
          };
        default:
          break;
      }
    return state
}