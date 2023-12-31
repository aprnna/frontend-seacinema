import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/auth-context'
import axios from '../api/axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpFromBracket, faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import TransactionList from '../components/transaction/transactionList'

export const MyProfile = () => {
  const { user,signOut } = useAuth()
  const [data, setData] = useState({
    name: user?.name,
    age: user?.age,
    username: user?.username,
  })
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <form className='flex flex-col max-w-md space-y-3 mx-auto px-4'>
      <label htmlFor='name'>Name</label>
      <input 
        id='name'
        type="text" 
        placeholder="Name" 
        name='name' 
        className="input-text" 
        value={data.name} 
        onChange={handleChange}
      />
      <label htmlFor='age'>Age</label>
      <input 
        id='age'
        type="text" 
        placeholder="Age" 
        name='age' 
        className="input-text" 
        value={data.age} 
        onChange={handleChange}
      />
      <label htmlFor='username'>Username</label>
      <input 
        id='username'
        type="text" 
        placeholder="Username" 
        name='username' 
        className="input-text" 
        value={data.username} 
        onChange={handleChange}
      />
      <button className='btn-primary bg-red-400' onClick={()=>signOut()}>Log out</button>
    </form>
  )
}

export const MyWallet = () => {
  const [user, setUser] = useState({})
  const [ value, setValue ] = useState(0)
  const [loading , setLoading] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [isTopup, setIsTopup] = useState(false)

  useEffect(() => {
    axios
    .get('/me')
    .then((res)=>{
      setUser(res.data)
    })
    .catch((err)=>{
      console.error(err.response.data.message)
    })
  }, [showInput])

  const toggleMode = (isTopup) => {
    setIsTopup(isTopup)
    setShowInput(!showInput)
    setShowButton(!showButton)
    setValue(0)
  }
  const handleTopUp = (e)=>{
    e.preventDefault()
    setLoading(true)
    axios
    .post('/transactions/topup',{
      total:value
    })
    .then((res)=>{
      toast.success(`Top Up Success`)
      toggleMode()
    })
    .catch((err)=>{
      console.error(err.response.data.message)
      toast.error(`Top Up Failed`)
    })
    .finally(()=>{
      setValue(0)
      setLoading(false)
    })
  }

  const handleWithdraw = (e)=>{
    e.preventDefault()
    setLoading(true)
    axios
    .post('/transactions/withdraw',{
      total:value
    })
    .then((res)=>{
      toast.success(`Withdraw Success`)
      toggleMode()
    })
    .catch((err)=>{
      console.error(err.response.data.message)
      toast.error(`Withdraw Failed`)
    })
    .finally(()=>{
      setValue(0)
      setLoading(false)
    })
  }
  return (
    <section className='max-w-lg mx-auto space-y-5'>
      <section className={`${showInput ? 'hidden':'block'} bg-blue-400 p-4 rounded-lg text-center`}>
        <h1 className='text-white text-lg'>Total Balance</h1>
        <p className='text-white text-2xl font-bold'>IDR {user?.balance}</p>
      </section>
      <section className={`${showInput ? 'block':'hidden'} space-y-4 bg-blue-400 p-4 rounded-lg`}>
        <h1 className='text-white text-lg font-bold'>{isTopup?'Top Up': 'Withdraw'}</h1>
        <input type="number" placeholder="Value" value={value} className={`input-text w-full`}  onChange={(e)=>setValue(e.target.value)}/>
        <div className='flex items-center gap-2 justify-end'>
          <button className='btn-primary' onClick={isTopup?handleTopUp:handleWithdraw}>{loading?'Loading..':isTopup?'Top Up': 'Withdraw'}</button>
          <button onClick={()=>toggleMode()} className='btn-light'>Cancel</button>
        </div>
      </section>
      <section className={`${showButton? 'block':'hidden'} flex justify-center gap-8`}>
        <div className='flex items-center flex-col'>
          <button onClick={()=>toggleMode(true)} className='bg-blue-900 rounded-full px-4 py-3 hover:bg-blue-300 w-fit'>
            <FontAwesomeIcon icon={faArrowUpFromBracket} size='lg' className='text-white'/>
          </button>
          <p>Top Up</p>
        </div>
        <div className='flex items-center flex-col'>
          <button onClick={()=>toggleMode(false)} className='bg-blue-900 rounded-full px-4 py-3 hover:bg-blue-300 w-fit'>
            <FontAwesomeIcon icon={faBuildingColumns} size='lg' className='text-white'/>
          </button>
          <p>Withdraw</p>
        </div>
      </section>
      <section>
        <h1 className='font-bold text-xl border-b-[1px] border-black pb-2'>Transaction</h1>
        <TransactionList/>
      </section>
    </section>
  )
}
