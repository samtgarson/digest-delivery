import { NextPage } from "next"
import { Btn } from "src/components/btn"

const Login: NextPage = () => {
  const { auth } = useSupabase()
  const signUp = useCallback(() => {
    auth.signIn({ provider: 'google', redirectTo: new URL('/app', window.location.origin) })
  }, [auth])

  return <>
    <h1>Login</h1>
    <Btn>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png" height="20" style={{ backgroundColor: 'white', padding: 3, borderRadius: 50 }} />
      <span>Login with Google</span>
    </Btn>
  </>
}

export default Login
