import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { Clock, MapPin, CheckCircle2, ChevronLeft, Calendar, FileText, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

export default function ProjectsScreen() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        const token = await AsyncStorage.getItem('userToken');
        if (!userInfoStr || !token) {
          setLoading(false);
          return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        const userId = userInfo._id || userInfo.id;
        const userType = userInfo.userType;

        const res = await apiClient.get('/jobs');
        let jobsData = res.data;

        // Filter jobs for the logged in user
        if (userType !== 'ADMIN') {
          jobsData = jobsData.filter((j: any) => j.workerId?._id === userId || j.hirerUserId?._id === userId || j.workerId === userId || j.hirerUserId === userId);
        }

        // Map backend Job data to the Projects format
        const mappedProjects = jobsData.map((job: any, index: number) => {
          const isCompleted = job.status === 'COMPLETED';
          return {
            id: job.id || job._id,
            title: job.requestId?.title || `Job Contract #${job._id?.substring(0, 5)}`,
            status: isCompleted ? "Completed" : "In Progress",
            // Give a placeholder image based on index to make it look nice
            image: [
              "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
            ][index % 3],
            location: job.requestId?.location || "Remote / Unspecified",
            completion: isCompleted ? 100 : 50,
            description: `Agreed Rate: Rs ${job.agreedRate}\n${job.requestId?.description || 'No description provided.'}`,
            timeline: [
              { date: "Contract", label: "Job Created", done: true },
              { date: "Current", label: "Work in Progress", done: isCompleted || job.status === 'ONGOING' },
              { date: "Final", label: "Job Completed", done: isCompleted }
            ]
          };
        });

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (selectedProject) {
    const project = selectedProject;
    return (
      <View style={tw`flex-1 bg-zinc-50 relative`}>
        <ScrollView contentContainerStyle={tw`pb-24`} showsVerticalScrollIndicator={false}>
          {/* Header Image */}
          <View style={[tw`relative bg-zinc-200`, { height: 224 }]}>
            <Image source={{ uri: project.image }} style={tw`w-full h-full`} />
            <LinearGradient
              colors={['transparent', 'rgba(24, 24, 27, 0.4)', '#18181b']}
              style={tw`absolute inset-0`}
            />
            
            <TouchableOpacity 
              onPress={() => setSelectedProject(null)}
              style={tw`absolute top-12 left-6 w-10 h-10 rounded-full bg-white/20 items-center justify-center`}
            >
              <ChevronLeft color="white" size={24} />
            </TouchableOpacity>

            <View style={tw`absolute bottom-6 left-6 right-6`}>
              <View style={tw`flex-row items-center gap-1.5 mb-2`}>
                <MapPin size={12} color="#f87171" />
                <Text style={tw`text-[10px] font-bold uppercase tracking-widest text-red-400`}>{project.location}</Text>
              </View>
              <Text style={tw`text-3xl font-bold text-white leading-tight`}>{project.title}</Text>
            </View>
          </View>

          <View style={tw`flex-1 px-6 pt-6 flex-col gap-6 -mt-4 bg-zinc-50 rounded-t-[24px]`}>
             {/* Progress Widget */}
            <View style={tw`bg-white p-5 rounded-2xl shadow-sm border border-zinc-100`}>
              <View style={tw`flex-row justify-between items-center mb-3`}>
                  <Text style={tw`font-bold text-zinc-900 text-sm`}>{project.status}</Text>
                  <Text style={tw`text-xs font-bold text-[#cc4518] uppercase tracking-widest`}>{project.completion}%</Text>
              </View>
              <View style={tw`w-full h-2 bg-zinc-100 rounded-full overflow-hidden`}>
                  <View style={[tw`h-full rounded-full`, { width: `${project.completion}%`, backgroundColor: project.completion === 100 ? '#18181b' : '#cc4518' }]} />
              </View>
            </View>

             {/* Description & Docs */}
            <View style={tw`bg-white p-5 rounded-2xl shadow-sm border border-zinc-100`}>
                <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide mb-2`}>Job Details</Text>
                <Text style={tw`text-sm text-zinc-500 font-medium leading-relaxed mb-4`}>{project.description}</Text>
                <View style={tw`flex-row gap-2`}>
                  {[
                    { icon: FileText, label: "Contract" },
                    { icon: Camera, label: "Photos" },
                    { icon: Calendar, label: "Schedule" }
                  ].map((btn, i) => (
                    <TouchableOpacity key={i} style={tw`flex-1 items-center justify-center gap-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-100`}>
                      <btn.icon size={20} color="#71717a" />
                      <Text style={tw`text-[10px] font-bold text-zinc-500 uppercase tracking-widest`}>{btn.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
            </View>

            {/* Timeline */}
            {project.timeline.length > 0 && (
              <View style={tw`mb-8`}>
                  <Text style={tw`text-sm font-bold text-zinc-900 tracking-wide mb-4`}>Job Progress</Text>
                  <View style={tw`px-2`}>
                    {project.timeline.map((step: any, i: number) => (
                      <View key={i} style={tw`flex-row gap-4 relative pb-6`}>
                        {i !== project.timeline.length - 1 && (
                          <View style={[tw`absolute top-6 left-[11px] w-[2px] h-full -ml-[1px]`, { backgroundColor: step.done ? '#cc4518' : '#e4e4e7' }]} />
                        )}
                        <View style={[tw`w-[22px] h-[22px] rounded-full items-center justify-center z-10 border-2`, step.done ? tw`bg-[#cc4518] border-[#cc4518]` : tw`bg-zinc-50 border-zinc-200`]}>
                          {step.done && <CheckCircle2 size={12} color="white" />}
                        </View>
                        <View style={tw`-mt-0.5`}>
                          <Text style={[tw`text-sm font-bold`, step.done ? tw`text-zinc-900` : tw`text-zinc-400`]}>{step.label}</Text>
                          <Text style={tw`text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5`}>{step.date}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-zinc-50`}>
      <ScrollView contentContainerStyle={tw`px-6 pt-6 pb-24`}>
        <Animated.View entering={FadeInUp.duration(600).springify()} style={tw`mb-8`}>
          <Text style={tw`text-4xl font-bold text-zinc-700 mb-2`}>Projects</Text>
          <Text style={tw`text-zinc-500 font-bold text-xs uppercase tracking-widest`}>Track your active jobs & contracts</Text>
        </Animated.View>
        
        {loading ? (
          <View style={tw`items-center justify-center py-20`}>
            <ActivityIndicator size="large" color="#cc4518" />
          </View>
        ) : projects.length === 0 ? (
          <Animated.View entering={FadeInUp.delay(200).duration(600).springify()} style={tw`bg-white rounded-[32px] border border-zinc-100 p-8 items-center`}>
            <Text style={tw`text-lg font-bold text-zinc-900 mb-2`}>No Active Jobs</Text>
            <Text style={tw`text-zinc-500 text-center font-medium`}>You don't have any ongoing hiring contracts right now. Explore workers to get started!</Text>
          </Animated.View>
        ) : (
          <View style={tw`flex-col gap-6`}>
            {projects.map((project, index) => (
              <Animated.View key={project.id} entering={FadeInUp.delay(200 + index * 100).duration(600).springify()}>
                <TouchableOpacity
                  onPress={() => setSelectedProject(project)}
                  style={tw`bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 flex-col gap-5`}
                >
                  {/* Project Image */}
                <View style={[tw`w-full rounded-[24px] overflow-hidden relative`, { height: 192 }]}>
                  <Image source={{ uri: project.image }} style={tw`w-full h-full`} />
                  <View style={tw`absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-full flex-row items-center gap-2`}>
                    {project.status === "Completed" ? (
                      <CheckCircle2 size={14} color="#18181b"/>
                    ) : (
                      <Clock size={14} color="#cc4518"/>
                    )}
                    <Text style={tw`text-xs font-bold uppercase tracking-widest text-zinc-900`}>{project.status}</Text>
                  </View>
                </View>

                {/* Project Details */}
                <View>
                  <Text style={tw`text-xl font-bold text-zinc-900 mb-2`}>{project.title}</Text>
                  <View style={tw`flex-row items-center gap-1.5 mb-6`}>
                    <MapPin size={14} color="#71717a" />
                    <Text style={tw`text-sm font-medium text-zinc-500`}>{project.location}</Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={tw`flex-col gap-3`}>
                    <View style={tw`flex-row justify-between items-center`}>
                        <Text style={tw`text-xs font-bold uppercase tracking-widest text-zinc-700`}>Progress</Text>
                        <Text style={tw`text-xs font-bold uppercase tracking-widest text-zinc-700`}>{project.completion}%</Text>
                    </View>
                    <View style={tw`w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden`}>
                        <View style={[tw`h-full rounded-full`, { width: `${project.completion}%`, backgroundColor: project.completion === 100 ? '#18181b' : '#cc4518' }]} />
                    </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
