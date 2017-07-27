---
title: Request
tags: [request]
---

<h1>Request</h1>

Title: ${
  request({
    uri: 'https://jsonplaceholder.typicode.com/posts/1',
    json: true,
    transform: (body) => body.title
  })
}
