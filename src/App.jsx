import Table from './components/table'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <div className="header shadow">
        <h3> Qtasnim - Test</h3>
      </div>
      <div className="container shadow p-3 mt-5">
        <Table />
      </div>
    </div>
  );
}

export default App;
