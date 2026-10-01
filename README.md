# Nigeria — The Story Continues V2

A deliberately short, horizontal, cinematic Independence Day experience.

The page is one continuous 7-panel horizontal world. Vertical wheel/touch input is translated into horizontal movement.

Files:
- index.html
- style.css
- script.js

The design intentionally favors visible motion and transformation over long-form content:
1. Opening / Independence
2. The Beginning
3. The Road
4. The People
5. Culture
6. The Next Chapter
7. Your Turn

No framework or heavy 3D library is used.


## V2.1 scroll architecture
The horizontal scene is now driven by a sticky viewport inside a tall scroll track. The browser keeps a normal vertical scroll model, while JavaScript maps scroll progress to horizontal panel translation. This avoids the previous body-height/overflow conflict.
