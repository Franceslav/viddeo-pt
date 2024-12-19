import Container from './container'

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className='py-6'>
      <Container>
        <p className='text-center text-sm font-normal text-muted-foreground'>Carlos Garavito &copy; {currentYear}</p>
      </Container>
    </footer>
  )
}

export default Footer