
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primeflex/themes/primeone-light.css"
import "primeflex/primeflex.css"
import { PrimeReactProvider } from "primereact/api"
import FeedbackForm from "./components/FeedbackForm"

const App = () => {
  return (
    <PrimeReactProvider>
      <FeedbackForm />
    </PrimeReactProvider>
  );
}
 
export default App;
