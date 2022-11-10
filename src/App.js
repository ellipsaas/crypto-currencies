import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap'
import { BrightnessHigh, Moon } from "react-bootstrap-icons";


function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [coins, setCoins] = useState([])
  const [filter, setFilter] = useState("")
  const [selectedItem, setSelectedItem] = useState()
  const [show, setShow] = useState(false)
  
  const handleClose = () => setShow(false);
  const handleShow = (coin) => {
    setSelectedItem(coin)
    setShow(true)
  }

  useEffect(() => {
    document.title = "Cryptocurrencies by Market Cap"

    fetch("https://ellipsaas.github.io/crypto-currencies/coins.json")
      .then(res => res.json())
      .then(data => setCoins(data))
      .catch(err => console.error(err))
  }, [])
  
  useEffect(() => {
    darkMode ? document.body.classList.add('darktheme') : document.body.classList.remove('darktheme')
  }, [darkMode])


  const CoinRow = ({coin}) => {
    return (
      <tr>
        <td className='text-center'>{coin.market_cap_rank}</td>
        <td className='text-start'>
          <div className="d-flex flex-row align-items-center">
            <img src={coin.image} className="me-3" width="28" alt={coin.name} />
            <span style={{ fontSize: "1rem" }}>{coin.name}</span>
            <span style={{ paddingTop: ".2rem", paddingLeft: ".5rem" }} className="text-uppercase">{coin.symbol}</span>
          </div>
        </td>
        <td>{new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(coin.current_price)}</td>
        <td className={coin.price_change_percentage_24h < 0 ? "text-red" : "text-green"}>{coin.price_change_percentage_24h.toFixed(2) + "%"}</td>
        <td>{new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(coin.total_volume)}</td>
        <td>{new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(coin.market_cap)}</td>
        <td><Button variant="primary" onClick={() => handleShow(coin)} className="btn-sm">price info</Button></td>
      </tr>
    )
  }

  const InfoModal = () => {

    let dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    let athDate = new Date(selectedItem.ath_date).toLocaleDateString("en-US", dateOptions)
    let atlDate = new Date(selectedItem.atl_date).toLocaleDateString("en-US", dateOptions)

    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="selectedItemTitle">
              <img src={selectedItem.image} width="28" alt={selectedItem.name} />
              <span className="ms-1 me-2">{selectedItem.name}</span>
              <span className="text-uppercase">({selectedItem.symbol})</span>
            </div>
            <div className="selectedItemPrice">
              {new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(selectedItem.current_price)}<span className={selectedItem.price_change_percentage_24h < 0 ? "text-red" : "text-green"}>{selectedItem.price_change_percentage_24h.toFixed(1)}%</span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row border-bottom">
              <div className="col itemDescription">{selectedItem.name} Price</div>
              <div className="col itemData">{new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(selectedItem.current_price)}</div>
            </div>
            <div className="row border-bottom">
              <div className="col itemDescription">24h Low / 24h High</div>
              <div className="col itemData">{new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(selectedItem.low_24h)} / {new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(selectedItem.high_24h)}</div>
            </div>
            <div className="row border-bottom">
              <div className="col itemDescription">Trading Volume</div>
              <div className="col itemData">{new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(selectedItem.total_volume)}</div>
            </div>
            <div className="row border-bottom">
              <div className="col itemDescription">Market Cap Rank</div>
              <div className="col itemData">#{selectedItem.market_cap_rank}</div>
            </div>
            <div className="row border-bottom">
              <div className="col itemDescription">Market Cap	</div>
              <div className="col itemData">{new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(selectedItem.market_cap)}</div>
            </div>
            <div className="row border-bottom">
              <div className="col itemDescription">All-Time High</div>
              <div className="col itemData">
                {selectedItem.ath}	<span className={selectedItem.ath_change_percentage < 0 ? "text-red" : "text-green"}>{selectedItem.ath_change_percentage.toFixed(1)}%</span>
                <div>{athDate}</div></div>
            </div>
            <div className="row border-bottom">
              <div className="col itemDescription">All-Time Low</div>
              <div className="col itemData">
                {selectedItem.atl}	<span className={selectedItem.atl_change_percentage < 0 ? "text-red" : "text-green"}>{selectedItem.atl_change_percentage.toFixed(1)}%</span>
                <div>{atlDate}</div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <>
      <div className="min-vh-100">
        <div className='container py-5'>
          <div className='d-flex flex-row justify-content-between align-items-end mb-4'>
            <h1 className='title m-0'>Cryptocurrency Prices by Market Cap</h1>
            <div>
              <Button variant='link' size='lg' onClick={() => setDarkMode(prevDarkMode => !prevDarkMode)}>{darkMode ? <BrightnessHigh /> : <Moon />}</Button>
              <span className='ms-3 d-none'>USD SELECT</span>
            </div>
          </div>
          <div>
            <Form.Group controlId="formSearch">
              <Form.Control type="input" placeholder="Search" value={filter} onChange={(evt) => setFilter(evt.target.value)} />
            </Form.Group>
          </div>
          <div className='mt-5'>
            <table className='w-100'>
              <thead>
                <tr>
                  <th className='px-2 text-center'>#</th>
                  <th className='text-start'>Coin</th>
                  <th>Price</th>
                  <th>24hr</th>
                  <th>24hr Volume</th>
                  <th>Mrkt Cap</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {coins
                  .filter((coins) => coins.name.toLowerCase().includes(filter.toLowerCase()) || coins.symbol.toLowerCase().includes(filter.toLowerCase()))
                  .slice(0, 20).map((coins) => (
                    <CoinRow key={coins.id} coin={coins} onSelect={coins => handleShow} />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedItem && (
        <InfoModal {...selectedItem} />
      )}
    </>
  );
}

export default App;
