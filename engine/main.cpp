#include "agent.h"
#include "sir.h"
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <cstring>
#include <pthread.h>

#define NUM_THREADS 4

int main(int argc, char* argv[]) {
    if (argc != 6) {
        std::cerr << "Usage: " << argv[0] << " <population> <beta> <gamma> <days> <network_type>" << std::endl;
        std::cerr << "Network type: 'random' or 'small_world'" << std::endl;
        return 1;
    }
    
    int population = atoi(argv[1]);
    double beta = atof(argv[2]);
    double gamma = atof(argv[3]);
    int days = atoi(argv[4]);
    std::string network_type = argv[5];

    std::cout << "day,S,E,I,R" << std::endl;

    if (population < 5000) {
        Agent* agents = new Agent[population];
        
        init_agents(agents, population, beta, std::min(10, population));

        if (network_type == "random") {
            double prob = std::min(1.0, beta * 10.0);
            build_erdos_renyi(agents, population, prob);
        } else if (network_type == "small_world") {
            int K = std::min(4, population - 1);
            double rewiring_prob = std::min(1.0, beta * 5.0);
            build_watts_strogatz(agents, population, K, rewiring_prob);
        } else {
            std::cerr << "Invalid network type. Use 'random' or 'small_world'" << std::endl;
            delete[] agents;
            return 1;
        }
        
        for (int day = 0; day <= days; day++) {
            int S, E, I, R;
            count_states(agents, population, S, E, I, R);
            std::cout << day << "," << S << "," << E << "," << I << "," << R << std::endl;
            
            if (day == days) break;
            
            pthread_t threads[NUM_THREADS];
            AgentBatch batches[NUM_THREADS];
            int agents_per_batch = population / NUM_THREADS;
            
            unsigned int seeds[NUM_THREADS];
            for (int t = 0; t < NUM_THREADS; t++) {
                seeds[t] = t * 12345 + 42;
            }
            
            for (int t = 0; t < NUM_THREADS; t++) {
                batches[t].agents = agents;
                batches[t].start_idx = t * agents_per_batch;
                batches[t].end_idx = (t == NUM_THREADS - 1) ? population : (t + 1) * agents_per_batch;
                batches[t].beta = beta;
                batches[t].gamma = gamma;
                batches[t].sigma = 0.2;
                batches[t].current_day = day;
                batches[t].seed = &seeds[t];
                
                pthread_create(&threads[t], NULL, update_agents, &batches[t]);
            }
            
            for (int t = 0; t < NUM_THREADS; t++) {
                pthread_join(threads[t], NULL);
            }
        }
        
        delete[] agents;
        
    } else {
        Population pop;
        pop.S = population;
        pop.E = 10.0;
        pop.I = 0.0;
        pop.R = 0.0;
        pop.beta = beta;
        pop.gamma = gamma;
        pop.sigma = 0.2;
        pop.mu = 0.0;

        double total_pop = pop.S + pop.E + pop.I + pop.R;
        
        for (int day = 0; day <= days; day++) {
            std::cout << day << ","
                      << static_cast<int>(pop.S + 0.5) << ","
                      << static_cast<int>(pop.E + 0.5) << ","
                      << static_cast<int>(pop.I + 0.5) << ","
                      << static_cast<int>(pop.R + 0.5) << std::endl;
            
            if (day == days) break;
            
            step_seir(pop, 1.0);
            
            double new_total = pop.S + pop.E + pop.I + pop.R;
            if (new_total > 0 && std::abs(new_total - total_pop) > 1e-6) {
                double scale = total_pop / new_total;
                pop.S *= scale;
                pop.E *= scale;
                pop.I *= scale;
                pop.R *= scale;
            }
        }
    }
    
    return 0;
}
