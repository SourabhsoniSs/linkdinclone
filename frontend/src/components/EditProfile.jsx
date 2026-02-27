import React, { useContext, useState, useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaCamera, FaTrash, FaBriefcase } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { UserDataContext } from "../context/UserContext";
import { AuthDataContext } from "../context/AuthDataContext";
import dpPlaceholder from '../assets/dp.webp';
import axios from 'axios';

function EditProfile() {
  const { user, setUser, setEdit } = useContext(UserDataContext);
  const { serverURL } = useContext(AuthDataContext);

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // --- ADD THESE TWO STATES TO HOLD ACTUAL FILES ---
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  let[saving,setSaving]=useState(false)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userName: user?.userName || "",
    skills: user?.skills || [], 
    education: user?.education || [{ college: "", degree: "", fieldOfStudy: "" }],
    experience: user?.experience || [{ title: "", company: "", description: "" }],
    gender: user?.gender || "",
    headline: user?.headline || "",
    location: user?.location || ""
  }); 

  const [profilePreview, setProfilePreview] = useState(user?.profileImage || dpPlaceholder);
  const [coverPreview, setCoverPreview] = useState(user?.coverImage || "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Skill Logic ---
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };
  const addSkill = () => setFormData({ ...formData, skills: [...formData.skills, ""] });
  const removeSkill = (index) => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) });
  const handleKeyDown = (e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } };

  // --- Education Logic ---
  const handleEduChange = (index, field, value) => {
    const updatedEdu = [...formData.education];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    setFormData({ ...formData, education: updatedEdu });
  };
  const addEducation = () => setFormData({ ...formData, education: [...formData.education, { college: "", degree: "", fieldOfStudy: "" }] });
  const removeEducation = (index) => setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });

  // --- Experience Logic ---
  const handleExpChange = (index, field, value) => {
    const updatedExp = [...formData.experience];
    updatedExp[index] = { ...updatedExp[index], [field]: value };
    setFormData({ ...formData, experience: updatedExp });
  };
  const addExperience = () => setFormData({ ...formData, experience: [...formData.experience, { title: "", company: "", description: "" }] });
  const removeExperience = (index) => setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });

  // --- UPDATED Image Logic ---
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Save the actual file for the Backend
      if (type === 'profile') setProfileFile(file);
      if (type === 'cover') setCoverFile(file);

      // 2. Create the preview for the UI
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') setProfilePreview(reader.result);
        if (type === 'cover') setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const formDataToSend = new FormData();

      // 1. Add simple fields
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("headline", formData.headline);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("location", formData.location);

      // 2. Add Arrays (Stringified)
      formDataToSend.append("skills", JSON.stringify(formData.skills.filter(s => s.trim() !== "")));
      formDataToSend.append("education", JSON.stringify(formData.education.filter(e => e.college.trim() !== "")));
      formDataToSend.append("experience", JSON.stringify(formData.experience.filter(ex => ex.title.trim() !== "")));

      // 3. Add Files
      if (profileFile) formDataToSend.append("profileImage", profileFile);
      if (coverFile) formDataToSend.append("coverImage", coverFile);

      const result = await axios.put(`${serverURL}/api/user/updateprofile`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      console.log(result);
      

      setUser(result.data);
      setEdit(false);
      setSaving(false)
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-[100] flex items-center justify-center">
      <div className="w-full h-full bg-black/50 absolute" onClick={() => setEdit(false)}></div>

      <div className="w-[95%] max-w-[550px] h-[90vh] bg-white relative z-[200] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Edit Intro</h2>
          <RxCross2 onClick={() => setEdit(false)} className="w-6 h-6 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-full" />
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
          
          {/* Images Section */}
          <div className="relative mb-16">
            <div className="w-full h-[150px] bg-gray-200 rounded-t-lg relative flex items-center justify-center overflow-hidden group cursor-pointer" onClick={() => coverInputRef.current.click()}>
              {coverPreview ? <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" /> : <FaCamera className="text-gray-400 text-2xl" />}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><FaCamera className="text-white text-2xl" /></div>
              <input type="file" hidden ref={coverInputRef} onChange={(e) => handleImageChange(e, 'cover')} />
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-white absolute bottom-[-40px] left-6 shadow-md group bg-white">
              <img src={profilePreview} alt="Profile" className="w-full h-full object-cover rounded-full" />
              <div onClick={() => profileInputRef.current.click()} className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><FaCamera className="text-white text-xl" /></div>
              <div onClick={() => profileInputRef.current.click()} className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white cursor-pointer"><FiPlus /></div>
              <input type="file" hidden ref={profileInputRef} onChange={(e) => handleImageChange(e, 'profile')} />
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">First Name*</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border-b border-gray-300 p-2 mt-1 outline-none focus:border-blue-600 bg-transparent" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Last Name*</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border-b border-gray-300 p-2 mt-1 outline-none focus:border-blue-600 bg-transparent" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Headline*</label>
              <textarea name="headline" value={formData.headline} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded mt-1 h-20 resize-none outline-none focus:border-blue-600" />
            </div>

            {/* Experience Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><FaBriefcase className="text-gray-400" /> Experience</label>
                <button type="button" onClick={addExperience} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"><FiPlus /> ADD EXPERIENCE</button>
              </div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-3 relative">
                  {formData.experience.length > 1 && <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500"><FaTrash size={12} /></button>}
                  <div className="flex flex-col gap-3">
                    <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => handleExpChange(index, "title", e.target.value)} className="w-full border-b border-gray-100 py-1 text-sm outline-none focus:border-blue-500" />
                    <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => handleExpChange(index, "company", e.target.value)} className="w-full border-b border-gray-100 py-1 text-sm outline-none focus:border-blue-500" />
                    <textarea placeholder="Description" value={exp.description} onChange={(e) => handleExpChange(index, "description", e.target.value)} className="w-full border-b border-gray-100 py-1 text-sm outline-none focus:border-blue-500 h-12 resize-none" />
                  </div>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Education</label>
                <button type="button" onClick={addEducation} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"><FiPlus /> ADD EDUCATION</button>
              </div>
              {formData.education.map((edu, index) => (
                <div key={index} className="bg-white border rounded-lg p-4 mb-3 relative">
                  {formData.education.length > 1 && <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500"><FaTrash size={12} /></button>}
                  <div className="flex flex-col gap-3">
                    <input type="text" placeholder="College / University" value={edu.college} onChange={(e) => handleEduChange(index, "college", e.target.value)} className="w-full border-b border-gray-200 py-1 text-sm outline-none focus:border-blue-500" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleEduChange(index, "degree", e.target.value)} className="border-b border-gray-200 py-1 text-sm outline-none focus:border-blue-500" />
                      <input type="text" placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => handleEduChange(index, "fieldOfStudy", e.target.value)} className="border-b border-gray-200 py-1 text-sm outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gender & Location */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border-b border-gray-300 p-2 mt-1 outline-none focus:border-blue-600 bg-transparent cursor-pointer">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Mumbai, India" className="w-full border-b border-gray-300 p-2 mt-1 outline-none focus:border-blue-600 bg-transparent" />
              </div>
            </div>

            {/* Skills Section */}
            <div className="border-t pt-4 pb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Skills</label>
                <button type="button" onClick={addSkill} className="text-blue-600 text-[10px] font-bold tracking-wider hover:underline"><FiPlus /> ADD</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-full px-3 py-1">
                    <input type="text" value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} onKeyDown={handleKeyDown} className="bg-transparent text-sm outline-none w-20 focus:w-28 transition-all" />
                    <RxCross2 onClick={() => removeSkill(index)} className="w-3 h-3 text-gray-500 cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="p-4 border-t flex justify-end bg-white">
          <button disabled={saving} onClick={handleUpdate} className="bg-[#0a66c2] text-white px-8 py-2 rounded-full font-semibold hover:bg-[#004182] shadow-md transition-all">
            {saving?"saving...": "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;