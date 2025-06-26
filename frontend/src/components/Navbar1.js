import { Link } from 'react-router-dom'
import './navbar.css';

function Navbar1() {
    return (<>
        <div className='navbar-wrapper' style={{ justifyContent: 'space-between', padding:'2vh' }}>
        <Link className='link1' to='/'><p id="landingpage-heading" style={{ fontSize: '5vh', width: '10vw'}}>Codefy</p></Link>
            <div className='flex' style={{ justifyContent: 'space-between', gap:'2vw' }}>
                <Link className='link2' style={{textDecoration:'none'}} to='/LogIn'>LogIn</Link>
                <Link className='link2' style={{textDecoration:'none'}} to='/SignUp'>SignUp</Link>
                </div>
        </div>
    </>)
}

export default Navbar1