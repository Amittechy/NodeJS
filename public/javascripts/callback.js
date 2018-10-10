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

function createPost(post,callback) {

setTimeout (() => {
posts.push(post);
callback();
},2000);


}


createPost( { title:'Post three' , body:'This is postthree' },getPosts);