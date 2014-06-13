



import os
import re

class MacroStatement:
	ins = "";
	arg = "";
	def __init__(self, line):
		line_macro = line.split(" ")[0];
		if line_macro[0:3] == "///" or line_macro[0:4] == "<!--":
			# we have an instruction.
			
			#get and store the instruction ins and arg:
			if line_macro[0:3] == "///":
				self.ins = line_macro[3:];
				self.arg = " ".join(line.split(" ")[1:]);
			else:
				self.ins = line_macro[4:];
				self.arg = " ".join(line.split(" ")[1:])[:-3]; #remove the -->


#for dir,dirs,files in os.walk("."):
#	if "main.js" in files:
#		maindir = dir;

		

crawled = []; #will be used to check that files are not crawled twice.

def crawl(path,filename):
	
	
	#keep track of everything that has already been crawled.
	crawled.append(os.path.join(path,filename));
	
	
	
	typeoffile = ""; #will be used to store the type of file we are currently inside.
	# determine the type of file we are crawling based on the extension. Supported types are HTML or JS
	if filename[-4:].upper()=="HTML" or filename[-3:].upper()=="HTM":
		typeoffile = "HTML";
	elif filename[-2:].upper()=="JS":
		typeoffile = "JS";
		
		
	curfile = ""; # will hold the contents of the output of this file;
	
	# add a line in the output to show what we are busy crawling.
	if(typeoffile == "JS"):
		curfile+= "\n\n\n// #########\t\t Crawling:"+os.path.join(path,filename)+"\t\t#########\n";
	elif (typeoffile == "HTML"):
		curfile+= "\n\n\n<!--#########\t\t Crawling:"+os.path.join(path,filename)+"\t\t#########-->\n";
	else:
		print "ERROR: unable to determine the type of file based on extension. .htm .html or .js";
		return "error";
	
	
	# Open the file specified in the arguments
	mf = open(path+"\\"+filename, "r");
	
	mflist = []; #will be used to store array of lines read from the file
	#read the lines from the file.
	for line in mf:
		mflist.append(line);
	
	
	i = 0;
	line = "";
	while i<len(mflist):
		line = mflist[i];
		# time to breakdown line into a compiler instruction.
		# an instruction line can begin with /// OR <!--
		line_macro = line.split(" ")[0];
		
		
		
		if line_macro[0:3] == "///" or line_macro[0:4] == "<!--":
			# we have an instruction. Lets get the argument before we continue
			
			# lets remove the rem from the instruction to get the macro:
			if line_macro[0:3] == "///":
				line_i = line_macro[3:];
				line_a = " ".join(line.split(" ")[1:]);
			else:
				line_i = line_macro[4:];
				line_a = " ".join(line.split(" ")[1:])[:-3]; #remove the -->
			
			
			
			
		else:
			#we don't have an instruction. We just add the line to the main string.
			curfile += line;
		
		
		
		
		
		
		if line[0:3] == "///":
			#INSTRUCTIONS
			if line[3]=="*":
				# IMPORT  using relative path
				importingfolder	= os.path.join(path,os.path.split(line[5:].replace("\n",""))[0]);
				importingfile	= os.path.split(line[5:].replace("\n",""))[1];
				importingpath	= os.path.join(importingfolder,importingfile);
				if importingpath in crawled:
					print ("...already imported "+importingpath);
				else:
					print ("Relative import "+importingpath);
					curfile+= crawl(importingfolder,importingfile);
			elif line[3]=="~":
				# IMPORT  using absolute path
				importingfolder	= os.path.join(".",os.path.split(line[5:].replace("\n",""))[0]);
				importingfile	= os.path.split(line[5:].replace("\n",""))[1];
				importingpath	= os.path.join(importingfolder,importingfile);
				if importingpath in crawled:
					print ("...already imported "+importingpath);
				else:
					print ("Absolute import "+importingpath);
					curfile+= crawl(importingfolder,importingfile);
			elif line[3]==".":
				# Disregard the remainder of this file.
				if filename[-4:]=="html" or filename[-3:]=="htm":
					curfile+= "\n\n\n<!--####### remainder of "+os.path.join(path,filename)+ " has not been imported ########-->\n";
				elif filename[-2:]=="js":
					curfile+= "\n// ####### remainder of "+os.path.join(path,filename)+ " has not been imported ########\n";
				print ("halt crawling of "+os.path.join(path,filename));
				break;
		i++;
				
	mf.close();
	
	
	return curfile;


	
def getMacro(line):
	
	

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



