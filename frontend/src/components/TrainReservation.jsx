import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainReservation = () => {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState("");
  const [book,setBook]=useState([])

  useEffect(() => {
    // Fetch all seats from the backend
    const fetchSeats = async () => {
      try {
      await axios.get('https://kind-teal-fossa-veil.cyclic.app/seat')
        .then((res)=>{
            console.log(res)
            function compare(a,b){
                return a.seatNumber-b.seatNumber
            }

            let y=res.data.seats
           y.sort(compare)
            setSeats(y);
        })
       
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeats();
  }, []);

  const reserveSeats = async () => {
    try {
      await axios.post('https://kind-teal-fossa-veil.cyclic.app/seat/reserve', { numSeats: parseInt(numSeats) }).then((res)=>{
        console.log(res.data.message);
        setBook(res.data.message)
        console.log(numSeats)
      })
      
      // Refresh the seat data after reservation
     await axios.get('https://kind-teal-fossa-veil.cyclic.app/seat')
     .then((res)=>{
        function compare(a,b){
            return a.seatNumber-b.seatNumber
        }

        let y=res.data.seats
         y.sort(compare)
        setSeats(y);
        setNumSeats('');
     })
      
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",marginBottom:"50px"}}>
      <h1>Train Reservation</h1>
      <div>
        <label htmlFor="numSeats">Number of Seats:</label>
        <input
          type="number"
          id="numSeats"
          value={numSeats}
          onChange={(e) => setNumSeats(e.target.value)}
        />
        <button onClick={reserveSeats}>Reserve Seats</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"10px",marginTop:"50px",alignItems:"center"}}>
      {seats.map((seat) => (
          
           <div key={seat._id} style={{width:"40px",height:"40px",backgroundColor:seat.isBooked ? "greenyellow":"yellow"}}>
          
              {/* <p>{seat.row}</p> */}
              <p>{seat.seatNumber}</p>
              {/* <td>{seat.isBooked ? 'Reserved' : 'Available'}</td> */}
            </div>
          
          ))}
           </div>
        
          <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
            <h4> Booked Seats No:-</h4>
          {book.map((el)=>(
            
           <p>{el}</p>
             
            ))}
           </div>
    </div>
  );
};

export default TrainReservation;
