import react from 'react'
import {withRouter} from 'react-router'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import Nav from './Nav'


class CreateMovie extends React.Component {
  state={description:'',
  imageUrl:'',
  avgRating:0,
  }

  render(){
    return (
      <div>
       <Nav />
       <h3 className="text-center"> Add Rotten Movie Ratings!</h3>
       <hr/>
       <div className='w-100 pa4 flex justify-center'>

         <div style={{ maxWidth: 400 }} className=''>

           <label> Movie Title: </label>
           <input
             className='w-100 pa3 mv2'
             value={this.state.description}
             placeholder='Title of the movie'
             onChange={(e) => this.setState({description: e.target.value})}
           />
           <label> Movie Cover Image: </label>
           <input
             className='w-100 pa3 mv2'
             value={this.state.imageUrl}
             placeholder='Image Url'
             onChange={(e) => this.setState({imageUrl: e.target.value})}
           />
           <label> Movie Rating as decided by Popular votes: </label>
           <input
             className='w-100 pa3 mv2'
             value={this.state.avgRating}
             type="number"
             placeholder='Average Rating'
             onChange={(e) => this.setState({avgRating: parseInt(e.target.value)})}
           />

           {this.state.imageUrl &&
             <img src={this.state.imageUrl} role='presentation' className='w-100 mv3' />
           }
           {this.state.description && this.state.imageUrl &&
             <button className='btn btn-info btn-lg' onClick={this.handleMovie}>Add New Movie</button>
           }
         </div>
       </div>
     </div>


    )
  }

  handleMove=()=>{
    const(description,imageUrl,avgRating}=this.state)
    this.props.addMovie({descritipn,imageUrl,avgRating})
    .then(()=>{
      this.props.router.push('/')
    })
  }
}
