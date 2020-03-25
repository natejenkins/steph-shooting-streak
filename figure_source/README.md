# figures
Figures used in authorea blog posts.  This uses the flot graphing library to generate the figures.  Due to issues with chrome, in order to include an html figure in an Authorea article you need to include any locally referenced style and js files inside the html file.  This is cumbersome to work with while creating these figures as everything ends up in one big mess.  For the time being I have come up with a workaround, if you run:

```
ruby build.rb
```

inside of this folder, it will open any html files that don't match "_output.html" and replace all local content include with the link tag (for css) or the script tag (for javascript) with the content of the respective file.  This produces an _output.html file which you can include in Authorea.  It is not a problem to have script tags to external references so those can stay in the html file.  As it stands, output files are put in figure folder directories.  This makes it easy to propogate changes to the online version of the article.
