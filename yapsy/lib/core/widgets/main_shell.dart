import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../router/route_names.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

/// Main app shell with 5-tab bottom navigation bar.
///
/// Wraps all tab routes via GoRouter [ShellRoute].
class MainShell extends StatelessWidget {
  final Widget child;

  const MainShell({super.key, required this.child});

  static const _tabs = [
    _TabItem(icon: Icons.home_rounded, label: 'Home', path: RoutePaths.home),
    _TabItem(icon: Icons.check_circle_outline_rounded, label: 'Tasks', path: RoutePaths.tasks),
    _TabItem(icon: Icons.mic_rounded, label: 'Yapsy', path: RoutePaths.voice),
    _TabItem(icon: Icons.book_rounded, label: 'Journal', path: RoutePaths.journal),
    _TabItem(icon: Icons.settings_rounded, label: 'Settings', path: RoutePaths.settings),
  ];

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    for (int i = 0; i < _tabs.length; i++) {
      if (location.startsWith(_tabs[i].path)) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final currentIndex = _currentIndex(context);

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          border: Border(
            top: BorderSide(color: AppColors.divider, width: 1),
          ),
        ),
        child: SafeArea(
          child: SizedBox(
            height: AppSpacing.bottomNavHeight,
            child: Row(
              children: List.generate(_tabs.length, (index) {
                final tab = _tabs[index];
                final isSelected = index == currentIndex;
                final isVoice = index == 2;

                return Expanded(
                  child: _NavItem(
                    icon: tab.icon,
                    label: tab.label,
                    isSelected: isSelected,
                    isVoice: isVoice,
                    onTap: () {
                      if (index != currentIndex) {
                        context.go(tab.path);
                      }
                    },
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }
}

class _TabItem {
  final IconData icon;
  final String label;
  final String path;

  const _TabItem({
    required this.icon,
    required this.label,
    required this.path,
  });
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final bool isVoice;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.isVoice,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (isVoice)
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: Colors.white,
                size: 22,
              ),
            )
          else
            Icon(
              icon,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              size: AppSpacing.iconSize,
            ),
          if (!isVoice) ...[
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontFamily: GoogleFonts.inter().fontFamily,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
