import { createContext, useContext, useState } from 'react'

const userContext = createContext()

const AuthContext = ({children}) => {
    const [user, setUser] = useState(null)

    const Login = (user) => {
        setUser(user)
    }

    // const Logout = (user) => {
    //     setUser(null)
    //     localStorage.removeItem("token")
    // }
    return (
        <userContext.Provider value={{user,Login}}>
            {children}
        </userContext.Provider>
    )
}

export const UseAuth = () => useContext(userContext)

export default AuthContext