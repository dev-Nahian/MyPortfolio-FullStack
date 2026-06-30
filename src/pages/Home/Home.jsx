import HeadingTitle from '../../component/HomeComponent/HeadingTitle'
import About from '../About/About'
import Project from '../Projects/Project'
import GetInTouch from '../GetInTouch/GetInTouch'
import MySkills from '../MySkills/MySkills'
import ContactWithMe from '../ContactWithMe/ContactWithMe'

const Home = () => {
  return (
    <>
        <HeadingTitle/>
        <About/>
        <Project/>
        <MySkills/>
        <ContactWithMe/>
        <GetInTouch/>
    </>
  )
}

export default Home