



import os
import re




#for dir,dirs,files in os.walk("."):
#	if "main.js" in files:
#		maindir = dir;

		

crawled = [];
def crawl(path,filename):
	
	
	
	crawled.append(os.path.join(path,filename));
	
	
	header = "\n\n\n// ################################################################\n";
	header+= "// \t\t"+os.path.relpath(path+"/"+filename)+"\n";
	
	curfile = "";
	imports = "";
	
	mf = open(path+"\\"+filename, "r");
	for line in mf:
		if line[0:3] == "///":
			if line[3]=="*":
				# Use relative path
				importingfolder	= os.path.join(path,os.path.split(line[5:].replace("\n",""))[0]);
				importingfile	= os.path.split(line[5:].replace("\n",""))[1];
				importingpath	= os.path.join(importingfolder,importingfile);
				if importingpath in crawled:
					print ("...already imported "+importingpath);
				else:
					print ("Relative import "+importingpath);
					header += "// \t\t\t"+importingpath+"\n";
					imports+= crawl(importingfolder,importingfile);
			elif line[3]=="~":
				# Use absolute path
				print ("From root to"+line[5:]);
		else:
			if re.match("^\s*$",line):
				pass;
				#curfile+=line;
			elif re.match("^.*{$",line):
				curfile += "\n"+line;
			elif re.match("^.*}$",line):
				curfile += line+"\n";
			else:
				curfile += line;
	mf.close();
	
	
	header+= "// ################################################################\n\n";
	return imports+header+curfile;

def filepart(fn):
	result = fn.replace("\n","").replace("/","\\");
	while "\\" in result:
		result = result[result.find("\\")+1:];
	return result
def folderpart(fn):
	result = fn.replace("\n","").replace("/","\\");
	if "\\" in result:
		result = result[::-1];
		result = result[result.find("\\")+1:];
		result = result[::-1];
		return "\\"+result;
	else:
		return "";




os.chdir("./cc_v03");
result=crawl(".","index.htm");
try:
	resfile = open("main_compiled.js","w");
	resfile.write(result);
	print("\ndone.");
	print(crawled)
except err:
	print("failed to write compiled result to file");
	print(err);
finally:
	resfile.close();



