import React, { useState, useEffect } from 'react'
import Loading from './Loading'
import Tours from './Tours'
import AddProduct from './AddProduct'
import data from './data.json'

 const url = `${process.env.REACT_APP_BE_URL}/products`

function App() {
  const [loading, setLoading] = useState(true)
  const [tours, setTours] = useState([])

  const removeTour = (id) => {
    const newTours = tours.filter((tour) => tour.id !== id)
    setTours(newTours)
  }

  const fetchTours = async () => {
    setLoading(true)
    try {
      const response = await fetch(url)
      console.log(response)
      const tours = await response.json()
      console.log(tours)
      setLoading(false)
      setTours(tours)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  useEffect(() => {
    fetchTours()
  }, [])

  function addProductHandler(movie) {
    console.log(movie);
  }

  if (loading) {
    return (
      <main>
        <Loading />
      </main>
    )
  }
  if (tours.length === 0) {
    return (
      <main>
        <div className='title'>
          <h2>no products left</h2>
          <button className='btn' onClick={() => fetchTours()}>
            refresh
          </button>
        </div>
      </main>
    )
  }
  return (
    <main>
      <section>
        <AddProduct onAddProduct={addProductHandler} />
      </section>
      <Tours tours={tours} removeTour={removeTour} />
    </main>
  )
}

export default App
