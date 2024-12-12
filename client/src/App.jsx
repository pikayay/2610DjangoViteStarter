import { useState } from 'react'
import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import * as cookie from "cookie"
import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  console.log(posts);

  async function getUser() {
    // gonna make a request. 
    const res = await fetch('/me', {
      credentials: "same-origin",
    })
    const body = await res.json();
    setUser(body.user);
    setLoading(false);
  }

  async function getPosts() {
    const res = await fetch("/posts/", {
      credentials: "same-origin",
    })

    const body = await res.json();
    setPosts(body.posts);
  }

  useEffect(() => {
    getUser();
    getPosts();
  }, [])

  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });

    if (res.ok) {
      // navigate away from the single page app!
      window.location = "/registration/sign_in/";
    } else {
      // handle logout failed!
    }
  }

  async function createPost(e) {
    e.preventDefault(); // don't actually submit the form!
    const res = await fetch("/posts/", {
      method: "post",
      credentials: "same-origin",
      body: JSON.stringify({
        title,
        content
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
      }
    })
    const body = await res.json();
    setPosts([...posts, body.post]);
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {user && <div>Hello {user.first_name}</div>}
      <button onClick={logout}>Logout</button>
      <form onSubmit={createPost} className="new-post-form">
        Title
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}/>
        <button>Save</button>
      </form>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            {post.content}
          </div>
        ))}
      </div>
    </>
  )
}

export default App;
