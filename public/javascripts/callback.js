const posts = [
    { title:'Post One' , body:'This is postOne' },
    { title:'Post two' , body:'This is posttwo' },
]
function getPosts(){
    setTimeout(() => {
let output = "";
posts.forEach((post,index) => {
    output += `<li>${post.title}</li> \n <li>${post.body} </li>`;
    document.body.innerHTML = output;
});

    },1000);
}

function createPost(post) {

setTimeout (() => {
posts.push(post);
},2000);

}

getPosts();
createPost( { title:'Post One' , body:'This is postOne' });