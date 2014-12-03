desc "Deploy"
task :deploy do
  system("rsync -avz --delete --filter=':- .gitignore' . ***REMOVED***:~/gluecksrad.***REMOVED***.de")
end

desc "Start development server"
task :server do
  system("php -S localhost:7878")
end