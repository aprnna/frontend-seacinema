import React, { useEffect,useState } from 'react'
import { useBooking } from '../context/booking-context'
import Layout from '../layouts/layout'
import { toast } from 'react-toastify'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { getFullDate} from '../utils/processDate'

export default function Booking() {
  const { showtimeData, movieData } = useBooking()
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seats,setSeats] = useState("")
  const navigate = useNavigate();
  const { user } = useAuth()
  const total = selectedSeats.length * movieData.price

  useEffect(() => {
    if (showtimeData.length === 0 || movieData.length === 0) {
      navigate('/')
    }
    setSeats(showtimeData.seats)
  }, [showtimeData, movieData, navigate])

  const Payment = (e) => {
    e.preventDefault()
    if (selectedSeats.length===0) {
      toast.warn('Please select your seat first')
      return
    }
    axios.post('/transactions', {
      movie_id: movieData._id,
      show_time_id: showtimeData._id,
      booking_seat: selectedSeats,
    }).then((res)=>{
      toast.success(res.data.message)
      navigate('/ticket')
    }).catch((err)=>{
      toast.error(err.response.data.message)
    })
  }
  const toggleSeatSelection = (seatKey) => {
    if (selectedSeats.includes(seatKey)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatKey));
    } else {
      if (selectedSeats.length < 6 && !seats[seatKey]) {
        setSelectedSeats([...selectedSeats, seatKey]);
      } else {
        toast.error('You can only select up to 6 seats.');
      }
    }
  };

  const renderSeats = () => {
    const newSeats = [];
    for (const key in showtimeData.seats) {
      const seatValue = seats[key];
      const isSelected = selectedSeats.includes(key);
      const isTaken = seatValue;
      const seatClassName = isSelected ? 'text-white bg-green-500' : isTaken ? 'bg-gray-300 text-gray-900' : 'text-gray-700';
      newSeats.push(
        <div
          key={key}
          className={`w-10 h-10 cursor-pointer rounded-md m-2 flex justify-center items-center shadow-lg ${seatClassName}`}
          onClick={() => toggleSeatSelection(key)}
        >
          <span>{key}</span>
        </div>
      );
    }
    return newSeats;
  }
  return (
    <Layout>
      <section className='mx-auto max-w-lg p-4 space-y-8 lg:space-y-0 lg:max-w-none lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4'>
        <section>
          <h1 className='text-xl font-bold'>{movieData.title}</h1>
          <div className='flex gap-4 my-2 lg:flex-col'>
            <div className='flex items-center gap-2 '>
              <div className='w-5 h-5 cursor-pointer rounded-md flex justify-center items-center shadow-lg text-white bg-green-500'/>
              <h6>Selected</h6>
            </div>
            <div className='flex items-center gap-2 '>
              <div className='w-5 h-5 cursor-pointer rounded-md flex justify-center items-center shadow-lg bg-gray-300 text-gray-900'/>
              <h6>Booked</h6>
            </div>
            <div className='flex items-center gap-2 '>
              <div className='w-5 h-5 cursor-pointer rounded-md flex justify-center items-center shadow-lg text-gray-700 border-2'/>
              <h6>Available</h6>
            </div>
          </div>
        </section>
        <section className=''>
          <div className='overflow-x-auto'>
            <div className='bg-yellow-500 h-10 w-[30rem] flex justify-center items-center font-bold my-4'>SCREEN</div>
            <div className='grid grid-cols-8 w-[30rem] justify-items-center mx-auto'>
              {renderSeats()}
            </div>
          </div>
        </section>
        <section>
          <table className='table-fixed w-full border-separate border-spacing-3'>
            <tbody>
              <tr className='border-b border-gray-200'>
                <td>Booker</td>
                <td>: {user.name}</td>
              </tr>
              <tr className='border-b border-gray-200'>
                <td className='align-top'>Time</td>
                <td>: {getFullDate(showtimeData.date)}</td>
              </tr>
              <tr className='border-b border-gray-200'> 
                <td>Cost</td>
                <td>: Rp. {movieData.price}</td>
              </tr>
              <tr className='border-b border-gray-200'>
                <td className=''>Seats</td>
                <td>:
                  {selectedSeats.length===0?<span>Select Seat</span>:
                    selectedSeats.map((seat) => (
                      <span key={seat}> {seat} </span>
                    ))
                  }
                </td>
              </tr>
              <tr className='border-b border-gray-200'>
                <td>Total</td>
                <td>: Rp. {total}</td>
              </tr>

            </tbody>
            
          </table>
          <button className='btn-primary w-full my-6' onClick={(e)=>Payment(e)}>Book Now</button>
        </section>
      </section>
      
    </Layout>
  )
}