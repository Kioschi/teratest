import '../styles/globals.scss'
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }) {
    return <SnackbarProvider maxSnack={3} autoHideDuration={1000}><Component {...pageProps} /></SnackbarProvider>
}

export default MyApp
