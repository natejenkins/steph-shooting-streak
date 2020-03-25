### Due to issues with sandboxing on chrome, we need to include any locally hosted js files
### in the actual html file.  I hate working like that so here is a small build script 
### to find any local script tags defined as '<script scr="path"></script>' and replace
### them with '<script>script_contents</script>'

html_files = Dir["./*.html"]
output_dir = "../figures"

html_files.each do |filename|
  if filename.match("_output.html")
    puts "skipping output file #{filename}"
    next
  end
  s = File.read(filename)
  s = s.gsub(/\s*<script src=\"([^:\"]*)\"><\/script>\n*/) do 
    contents = File.read($1)
    "\n<script>\n" + contents + "\n</script>\n"
  end

  # matching <link href="examples.css" rel="stylesheet" type="text/css">
  s = s.gsub(/\s*<link href=\"([^:\"]*)\" rel=\"stylesheet\" type=\"text\/css\">\n*/) do 
    contents = File.read($1)
    "\n<style>\n" + contents + "\n</style>\n"
  end
  newfilename = filename.sub(/(.*).html/, "\\1_output.html")
  figure_folder = filename.sub(/(.*).html/, "\\1")
  puts "compiling #{newfilename}"
  File.write(File.join(output_dir, figure_folder, newfilename), s)
end
