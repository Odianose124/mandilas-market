import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
} from "lucide-react";


function Profile() {

  const { user, updateUser } = useAuth();


  const [formData, setFormData] = useState({

    firstName: user?.firstName || "",

    lastName: user?.lastName || "",

    email: user?.email || "",

    phone: user?.phone || "",

    address: user?.address || "",

    avatar: user?.avatar || "",

  });



  const [editing, setEditing] = useState(false);



  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData({

      ...formData,

      [name]: value,

    });

  };

    const handleSave = () => {

    updateUser(formData);

    setEditing(false);

  };


  if (!user) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h2 className="text-2xl font-bold">

          Please login to view profile

        </h2>

      </div>

    );

  }



  return (

    <section className="min-h-screen bg-gray-100 py-10">


      <div className="max-w-5xl mx-auto px-4">


        <div className="bg-white rounded-2xl shadow p-8">


          {/* Profile Header */}

          <div className="flex flex-col md:flex-row items-center gap-6 mb-10">


            <div className="relative">


              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">


                {formData.avatar ? (

                  <img

                    src={formData.avatar}

                    alt="Profile"

                    className="w-full h-full object-cover"

                  />

                ) : (

                  <User

                    size={60}

                    className="text-green-600"

                  />

                )}


              </div>


              <button className="absolute bottom-0 right-0 bg-green-600 text-white p-3 rounded-full">


                <Camera size={18} />


              </button>


            </div>



            <div>


              <h1 className="text-3xl font-bold">

                {user.firstName} {user.lastName}

              </h1>


              <p className="text-gray-500 mt-2">

                Buyer Account

              </p>


              <p className="text-sm text-gray-400 mt-2">

                Joined:

                {" "}

                {new Date(user.joinedDate).toLocaleDateString()}

              </p>


            </div>


          </div>



          {/* Profile Form */}


          <div className="grid md:grid-cols-2 gap-6">



            <div>

              <label className="font-semibold block mb-2">

                First Name

              </label>


              <div className="flex items-center border rounded-lg px-4">


                <User size={18} className="text-gray-400" />


                <input

                  type="text"

                  name="firstName"

                  value={formData.firstName}

                  onChange={handleChange}

                  disabled={!editing}

                  className="w-full p-3 outline-none"

                />


              </div>

            </div>



            <div>

              <label className="font-semibold block mb-2">

                Last Name

              </label>


              <div className="flex items-center border rounded-lg px-4">


                <User size={18} className="text-gray-400" />


                <input

                  type="text"

                  name="lastName"

                  value={formData.lastName}

                  onChange={handleChange}

                  disabled={!editing}

                  className="w-full p-3 outline-none"

                />


              </div>

            </div>

                        <div>

              <label className="font-semibold block mb-2">

                Email

              </label>


              <div className="flex items-center border rounded-lg px-4">


                <Mail
                  size={18}
                  className="text-gray-400"
                />


                <input

                  type="email"

                  name="email"

                  value={formData.email}

                  onChange={handleChange}

                  disabled={!editing}

                  className="w-full p-3 outline-none"

                />


              </div>

            </div>



            <div>

              <label className="font-semibold block mb-2">

                Phone Number

              </label>


              <div className="flex items-center border rounded-lg px-4">


                <Phone
                  size={18}
                  className="text-gray-400"
                />


                <input

                  type="text"

                  name="phone"

                  value={formData.phone}

                  onChange={handleChange}

                  disabled={!editing}

                  placeholder="Enter phone number"

                  className="w-full p-3 outline-none"

                />


              </div>

            </div>



            <div className="md:col-span-2">


              <label className="font-semibold block mb-2">

                Delivery Address

              </label>


              <div className="flex items-start border rounded-lg px-4">


                <MapPin
                  size={18}
                  className="text-gray-400 mt-4"
                />


                <textarea

                  name="address"

                  value={formData.address}

                  onChange={handleChange}

                  disabled={!editing}

                  placeholder="Enter your delivery address"

                  className="w-full p-3 outline-none resize-none"

                  rows="4"

                />


              </div>


            </div>


          </div>


          {/* Buttons */}


          <div className="flex justify-end gap-4 mt-10">


            {!editing ? (

              <button

                onClick={() => setEditing(true)}

                className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"

              >

                Edit Profile

              </button>


            ) : (

              <>


                <button

                  onClick={() => setEditing(false)}

                  className="px-8 py-3 rounded-lg border font-semibold"

                >

                  Cancel

                </button>



                <button

                  onClick={handleSave}

                  className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"

                >

                  Save Changes

                </button>


              </>

            )}


          </div>


        </div>


      </div>


    </section>

  );

}


export default Profile;