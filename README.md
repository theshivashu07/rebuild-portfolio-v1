"# rebuild-portfolio-v1" 






## How to make website accessible vie .../about/ instead of using .../about.html. Settings up according to vercel !!!


### Agar aap Vercel use kar rahe hain:

Apni website ke root folder (main folder) mein ek vercel.json naam ki file banayein aur usme yeh code daal dein:
```
json
{
  "cleanUrls": true
}
```

But yad rahe ki aap es tarah se localhost pe chalayenge t vo work nahi karega.
To locally chalane ke liye to aapko about.html hi use karna hai, /about/ nahi, okay?!!!!


### Fix: Apne CSS Link ke aage / lagayein

Apni HTML files (jaise about.html) ko open karein aur jahan CSS linked hai, wahan path ke shuruat mein ek forward slash / jod dein.

• Galat (Relative Path):
```
html
<link rel="stylesheet" href="style.css"> 
<!-- ya -->
<link rel="stylesheet" href="./style.css">
```

• Sahi (Absolute Path): Path ke aage / lagayein
```
html
<link rel="stylesheet" href="/style.css">
```


