cp#include<bits/stdc++.h>
/*
 
 █████╗  ██████╗ ██████╗███████╗██████╗ ████████╗    ██╗  ██╗ ██████╗      ██╗ █████╗     ██████╗ ██╗     ███████╗        ██╗
██╔══██╗██╔════╝██╔════╝██╔════╝██╔══██╗╚══██╔══╝    ██║  ██║██╔═══██╗     ██║██╔══██╗    ██╔══██╗██║     ██╔════╝    ██╗██╔╝
███████║██║     ██║     █████╗  ██████╔╝   ██║       ███████║██║   ██║     ██║███████║    ██████╔╝██║     ███████╗    ╚═╝██║ 
██╔══██║██║     ██║     ██╔══╝  ██╔═══╝    ██║       ██╔══██║██║   ██║██   ██║██╔══██║    ██╔═══╝ ██║     ╚════██║    ██╗██║ 
██║  ██║╚██████╗╚██████╗███████╗██║        ██║       ██║  ██║╚██████╔╝╚█████╔╝██║  ██║    ██║     ███████╗███████║    ╚═╝╚██╗
╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚═╝        ╚═╝       ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚═╝  ╚═╝    ╚═╝     ╚══════╝╚══════╝        ╚═╝                                                                                                                            ╚══════╝ ╚═════╝   ╚═══╝  ╚══════╝       ╚═╝    ╚═════╝  ╚═════╝     ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝       ╚═╝ 
                                                                                                                  
*/
using namespace std;
 
#define fastio() ios_base::sync_with_stdio(false);cin.tie(NULL);cout.tie(NULL)
#define MOD 1000000007
#define MOD1 998244353
#define INF 1e18
#define nline "\n"
#define pb push_back
#define ppb pop_back
#define mp make_pair
#define ff first
#define ss second
#define PI 3.141592653589793238462
#define set_bits __builtin_popcountll
#define sz(x) ((int)(x).size())
#define all(x) (x).begin(), (x).end()
 
typedef long long ll;
typedef unsigned long long ull;
typedef long double lld;
// typedef tree<pair<int, int>, null_type, less<pair<int, int>>, rb_tree_tag, tree_order_statistics_node_update > pbds; // find_by_order, order_of_key
 
#ifndef ONLINE_JUDGE
#define debug(x) cout << #x <<" "; _print(x); cout << endl;
#else
#define debug(x)
#endif
 
void _print(ll t) {cout << t;}
void _print(int t) {cout << t;}
void _print(string t) {cout << t;}
void _print(char t) {cout << t;}
void _print(lld t) {cout << t;}
void _print(double t) {cout << t;}
void _print(ull t) {cout << t;}
 
template <class T, class V> void _print(pair <T, V> p);
template <class T> void _print(vector <T> v);
template <class T> void _print(set <T> v);
template <class T, class V> void _print(map <T, V> v);
template <class T> void _print(multiset <T> v);
template <class T, class V> void _print(pair <T, V> p) {cout << "{"; _print(p.ff); cout << ","; _print(p.ss); cout << "}";}
template <class T> void _print(vector <T> v) {cout << "[ "; for (T i : v) {_print(i); cout << " ";} cout << "]";}
template <class T> void _print(set <T> v) {cout << "[ "; for (T i : v) {_print(i); cout << " ";} cout << "]";}
template <class T> void _print(multiset <T> v) {cout << "[ "; for (T i : v) {_print(i); cout << " ";} cout << "]";}
template <class T, class V> void _print(map <T, V> v) {cout << "[ "; for (auto i : v) {_print(i); cout << " ";} cout << "]";}

int f(int i , int prev , vector<int> &v){
    if(i >= v.size())return 0;

    int pick = 0;
    int notPick = f(i+1 , prev , v);
    if(prev == -1 || v[i] > v[prev]){
        pick = 1 + f(i+1 , i , v);
    }

    return max(pick , notPick);
}

int main() {
#ifndef ONLINE_JUDGE
    freopen("Error.txt", "w", stderr);
#endif
    int n;
    cin>>n;

    vector<int> v(n);
    for(int i=0; i<n ; i++)cin>>v[i];

    cout<<f(0 , -1 , v)<<endl;
}