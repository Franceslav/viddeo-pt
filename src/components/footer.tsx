import Container from './container'

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className='py-6 bg-black'>
      <Container>
        <p className='text-center text-sm font-black text-white bg-black p-2 rounded-lg border-2 border-yellow-400 transform -rotate-1 inline-block' style={{ textShadow: '1px 1px 0px #000000' }}>
          <a href="https://fluttrium.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
            FLUTTRIUM
          </a> &copy; {currentYear} - &quot;IT WORKS ON MY MACHINE!&quot;
        </p>
      </Container>
    </footer>
  )
}

export default Footer