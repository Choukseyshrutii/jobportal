<<<<<<< HEAD
import React, { useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {

console.log({user})
    }, [user])

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div className='flex items-center gap-4'>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>

                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-6 text-gray-700'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies" className='hover:text-[#F83002]'>Companies</Link></li>
                                    <li><Link to="/admin/jobs" className='hover:text-[#F83002]'>Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/" className='hover:text-[#F83002]'>Home</Link></li>
                                    <li><Link to="/jobs" className='hover:text-[#F83002]'>Jobs</Link></li>
                                    <li><Link to="/browse" className='hover:text-[#F83002]'>Browse</Link></li>
                                </>
                            )
                        }
                    </ul>

                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className='flex items-center gap-2 cursor-pointer'>
                                        <Avatar className='ring-1 ring-gray-100 hover:ring-[#F83002] transition'>
                                            {
                                                user?.profile?.profilePhoto ? (
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || 'avatar'} />
                                                ) : (
                                                    <AvatarFallback>
                                                        {(() => {
                                                            const name = user?.fullname || user?.email || '';
                                                            const parts = name.split(' ').filter(Boolean);
                                                            const initials = parts.length === 1 ? parts[0].charAt(0) : (parts[0].charAt(0) + parts[parts.length-1].charAt(0));
                                                            return initials.toUpperCase();
                                                        })()}
                                                    </AvatarFallback>
                                                )
                                            }
                                        </Avatar>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4">
                                    <div className='space-y-3'>
                                        <div className='flex items-center gap-3'>
                                            <Avatar className='h-14 w-14'>
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || 'avatar'} />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-semibold'>{user?.fullname}</h4>
                                                <p className='text-sm text-gray-500'>{user?.profile?.bio || (user?.role === 'recruiter' ? 'Recruiter' : 'Candidate')}</p>
                                            </div>
                                            <div className='ml-auto'>
                                                <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>{user?.role}</span>
                                            </div>
                                        </div>

                                        <div className='grid gap-2'>
                                            {
                                                user?.role === 'student' && (
                                                    <Link to="/profile" className='text-left text-sm text-gray-700 hover:text-[#F83002]'>View Profile</Link>
                                                )
                                            }

                                            {
                                                user?.role === 'recruiter' && (
                                                    <>
                                                        <Link to="/admin/companies" className='text-left text-sm text-gray-700 hover:text-[#F83002]'>Company dashboard</Link>
                                                        <Link to="/admin/jobs" className='text-left text-sm text-gray-700 hover:text-[#F83002]'>Manage jobs</Link>
                                                        <Link to="/admin/jobs/create" className='text-left text-sm text-gray-700 hover:text-[#F83002]'>Post a job</Link>
                                                    </>
                                                )
                                            }

                                            <Link to="/jobs" className='text-left text-sm text-gray-700 hover:text-[#F83002]'>Browse jobs</Link>
                                        </div>

                                        <div className='pt-2 border-t border-gray-100'>
                                            <div className='flex items-center gap-2'>
                                                <Button onClick={logoutHandler} className='w-full bg-[#F83002] hover:bg-[#d62b00] text-white'>Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

=======
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link to="/admin/companies">Companies</Link></li>
                                    <li><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/jobs">Jobs</Link></li>
                                    <li><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

>>>>>>> origin/main
export default Navbar