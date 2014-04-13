



import os
import re




#for dir,dirs,files in os.walk("."):
#	if "main.js" in files:
#		maindir = dir;

		

crawled = [];
def crawl(path,filename):
	
	
	
	crawled.append(os.path.join(path,filename));
	
	
	curfile = "";
	if filename[-4:]=="html" or filename[-3:]=="htm":
		curfile+= "\n\n\n<!--#########\t\t Crawling:"+os.path.join(path,filename)+"\t\t#########-->\n";
	elif filename[-2:]=="js":
		curfile+= "\n\n\n// #########\t\t Crawling:"+os.path.join(path,filename)+"\t\t#########\n";
	header = "";
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
					curfile+= crawl(importingfolder,importingfile);
			elif line[3]=="~":
				# Use absolute path
				importingfolder	= os.path.join(".",os.path.split(line[5:].replace("\n",""))[0]);
				importingfile	= os.path.split(line[5:].replace("\n",""))[1];
				importingpath	= os.path.join(importingfolder,importingfile);
				if importingpath in crawled:
					print ("...already imported "+importingpath);
				else:
					print ("Absolute import "+importingpath);
					header += "// \t\t\t"+importingpath+"\n";
					curfile+= crawl(importingfolder,importingfile);
			elif line[3]==".":
				# Disregard the remainder of this file.
				if filename[-4:]=="html" or filename[-3:]=="htm":
					curfile+= "\n\n\n<!--####### remainder of "+os.path.join(path,filename)+ " has not been imported ########-->\n";
				elif filename[-2:]=="js":
					curfile+= "\n// ####### remainder of "+os.path.join(path,filename)+ " has not been imported ########\n";
				print ("halt crawling of "+os.path.join(path,filename));
				break;
		else:
			if re.match("^\s*$",line):
				pass;
			elif re.match("^.*{$",line):
				curfile += "\n"+line;
			elif re.match("^.*}$",line):
				curfile += line+"\n";
			elif re.match("^-->\n$",line):
				curfile += "\n";
			elif re.match("^<!--$",line):
				curfile += "\n";
			else:
				curfile += line;
	mf.close();
	
	
	header+= "// ################################################################\n\n";
	return imports+curfile;

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
	resfile = open("index_compiled.htm","w");
	resfile.write(result);
	print("\ndone.");
	print(crawled)
except err:
	print("failed to write compiled result to file");
	print(err);
finally:
	resfile.close();



