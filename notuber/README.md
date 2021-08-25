1. All parts of the lab have been implemented correctly
2. I did not collaborate with anyone on this lab
3. I spent about 1-2 hours completing this lab, most of it was spent
    learning the material.

For Part 3 of Notuber:
1. All parts of the lab have been implemented correctly and numbers 3 and 4 of Going Beyond
    have been implemented as well. The main error that was occurring after I learned how to 
    insert data into the database was that there was a CORS error that was popping up continuously.
    I spent many hours testing different ways that I could fix this problem and even took a look at my 
    code from notuber to see if anything was wrong there. In the end the error was caused because I 
    was adding 15 random cars to the database, selecting these 15(but I had messed up here because
    I had another for loop inside the for loop that added the 15 cars, which caused the program
    to run very very slow). Then after selecting the 15 and when the program ended, I would then clear
    the database. Apparently it was this lagging that caused the program to malfunction, and the heroku server 
    to give me an error. This took a long time to figure out because at first, after I pushed to heroku main,
    the first time I reloaded the page, it would work perfectly fine everytime, the second time had like a 70%
    chance of working and the third time always gave a CORS error. At one point I thought that this was due to 
    Google Chrome sending out its preflight request, and I tested this but it didn't work. THenafter using curl in terminal, 
    I found out that the error wasn't caused by CORS but more so that I was doing something very wrong that caused the 
    server to malfunction. 
2. I did not collaborate with anyone on this lab
3. I lost track of how much time was spent on this part due to multiple errors occurring and
    slowly debugging