
<h1>P4 for Richard Tizard: DNA Sequence Request Submission and Results Retrieval</h1>
<p>As I have mentioned before, for 30 years ending in August, 2012 I was responsible for determining, editing, curating, and warehousing DNA sequence data for a local biopharma company. 
For the most recent 20 years of that period, much of our work was co-ordinated by a client-server <a href='http://www.4d.com/'>4D database</a> I developed. For P4, I would like to write a web application from scratch to 
handle some of the functionality of that 4D application. I say from scratch because 4D is 1) a procedural rather than object-oriented tool (with a Pascal-like syntax), 2) the database 
engine in my application does not use SQL, and 3) interface  elements in a 4D application are selected and positioned, etc. through a GUI interface. I will concentrate on a small subset 
of the 4D app's functionality, at least at first: the submission and retrieval of data by the (relatively) non-expert client users of the system. Mimicking all the functionality provided 
to aid expert lab personnel in their day to day activities would be a mammoth undertaking. This would involve selecting reaction sets, producing text files to drive robotics, tracking 
raw data, preparing and storing analyzed data packages, maintaining data on remote servers available through other interfaces, etc. Although you haven't yet covered this topic in class, 
I hope to use AJAX to keep the user interface from being clunky. I would love to try hooking the application back end to some additional analysis tools, just for exercise purposes,
trying out one of two approaches: 1) using AJAX to initiate a web services request using SOAP (or REST?) to a remote server capable of responding to requests for data analysis, e.g. <a href='http://www.ebi.ac.uk/Tools/webservices/'>EBI</a>;
or 2) using AJAX to request results from a small service on the web host with locally hosted tools, probably from the <a href = 'http://emboss.sourceforge.net/'>EMBOSS</a> open-source collection.</p>
<p>This work could find practical application. If I add browser based
client-facing functionality to my current 4D application, I might more easily convince another company of the utility of incorporating such an intranet-available service into 
their operation. This might be my most attractive next career move. Alternatively, I might set up a very full featured service as a small stand-alone company serving multiple 
companies, where a secure web site for submission and retrieval would be absolutely critical. (Admittedly, I would probably need some expert help in this case.) Since 2006 or
so, 4D has supplied a SQL engine, although as alluded to above I have used its legacy engine, so SQL code written for this application might be redirected at a 4D backend rather 
than MySQL. There are a few possibilities here.</p>
<p>One caveat: without guidance, it may be not entirely trivial for you to interact with the site for testing and evaluation purposes. I'll try to be 
mindful of setting up useful test cases for you to play with.</p>
<p>Any ideas for particularly useful/interesting avenues to explore would be <span class='ColorMe'>greatly</span> appreciated.</p>
<a href=/index/index/>Visit the Site!</a>
<br><br>