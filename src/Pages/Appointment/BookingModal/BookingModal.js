import { format } from 'date-fns';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../contexts/AuthProvider';

const BookingModal = ({ treatment, selectedDate, setTreatment, refetch }) => {
    const date = format(selectedDate, 'PP')
    const { name: treatmentName, slots, price } = treatment; // treatment is appointment options just different name
    const { user } = useContext(AuthContext);

    const handleBooking = event => {
        event.preventDefault();
        const form = event.target;
        const slot = form.slot.value;
        const name = form.name.value;
        const email = form.email.value;
        const phone = form.phone.value;

        const booking = {
            appointmentDate: date,
            treatment: treatmentName,
            patient: name,
            slot,
            email,
            phone,
            price
        }
        fetch('http://localhost:5000/bookings', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(booking)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.acknowledged) {
                    setTreatment(null);
                    toast.success('Booking confirmed');
                    refetch()
                }
                else{
                    toast.error(data.message);
                }
            })



    }
    return (
        <>
            <input type="checkbox" id="booking-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="booking-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">{treatmentName}</h3>
                    <form onSubmit={handleBooking} className='grid grid-cols-1 gap-3 mt-10'>
                        <input type="text" disabled value={date} className="input w-full input-bordered" />
                        <select name='slot' className="select select-bordered w-full">

                            {
                                slots.map((slot, key) => <option value={slot} key={key}>{slot}</option>)
                            }
                        </select>
                        <input type="text" name='name' defaultValue={user?.displayName} disabled placeholder="Your Name" className="input w-full input-bordered" />
                        <input type="email" name='email' defaultValue={user?.email} disabled placeholder="Email Address" className="input w-full input-bordered" />
                        <input type="text" name='phone' placeholder="Phone Number" className="input w-full input-bordered" />
                        <input type="submit" value="Submit" className="input w-full btn-accent" />

                    </form>
                </div>
            </div>
        </>
    );
};

export default BookingModal;